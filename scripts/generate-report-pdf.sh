#!/bin/bash

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "Docker não encontrado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Diretório do relatório
REPORT_DIR="docs"
INPUT_FILE="$REPORT_DIR/relatorio-beta.md"
OUTPUT_FILE="$REPORT_DIR/relatorio-beta.pdf"

# Verifica se o arquivo de entrada existe
if [ ! -f "$INPUT_FILE" ]; then
    echo "Arquivo de entrada não encontrado: $INPUT_FILE"
    exit 1
fi

# Cria o diretório de saída se não existir
mkdir -p "$REPORT_DIR"

# Converte SVG para PNG
echo "Convertendo logo para PNG..."
if ! command -v rsvg-convert &> /dev/null; then
    sudo dnf install -y librsvg2-tools
fi
rsvg-convert -h 200 docs/assets/logo.svg > docs/assets/logo.png

# Cria um Dockerfile temporário
cat > Dockerfile.temp << 'EOF'
FROM alpine:latest
RUN apk add --no-cache \
    pandoc \
    texlive \
    texlive-xetex \
    texmf-dist-latexextra \
    texmf-dist-fontsextra \
    librsvg

WORKDIR /data
ENTRYPOINT ["pandoc"]
EOF

# Constrói a imagem
echo "Construindo imagem Docker..."
sudo docker build -t pandoc-alpine -f Dockerfile.temp .

# Remove o Dockerfile temporário
rm Dockerfile.temp

# Gera o PDF usando Docker
echo "Gerando PDF..."
sudo docker run --rm \
    -v "$(pwd):/data:Z" \
    pandoc-alpine \
    "$INPUT_FILE" \
    -f markdown \
    -t pdf \
    -o "$OUTPUT_FILE" \
    --pdf-engine=xelatex \
    --toc \
    --toc-depth=3 \
    --highlight-style=tango \
    --variable geometry:margin=1in \
    --variable links-as-notes=true \
    --variable colorlinks=true \
    --variable urlcolor=blue \
    --variable toccolor=blue \
    --variable fontsize=11pt

# Ajusta as permissões do arquivo gerado
if [ -f "$OUTPUT_FILE" ]; then
    sudo chown $USER:$USER "$OUTPUT_FILE"
    echo "PDF gerado com sucesso: $OUTPUT_FILE"
    # Limpa arquivos temporários
    rm -f docs/assets/logo.png
else
    echo "Erro ao gerar o PDF"
    exit 1
fi 