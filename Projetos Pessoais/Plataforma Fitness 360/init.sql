-- Criar tabelas base
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de teste
INSERT INTO tenants (name) VALUES ('Academia Teste');

INSERT INTO members (tenant_id, name, email) 
SELECT 
    (SELECT id FROM tenants WHERE name = 'Academia Teste'),
    'João Silva',
    'joao@teste.com'
WHERE NOT EXISTS (
    SELECT 1 FROM members WHERE email = 'joao@teste.com'
); 