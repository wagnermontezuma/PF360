import argparse
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, List

def load_model(model_path: str) -> Dict:
    """
    Carrega o modelo treinado e seus componentes
    """
    try:
        saved_data = joblib.load(model_path)
        return saved_data
    except Exception as e:
        raise Exception(f"Erro ao carregar modelo: {str(e)}")

def prepare_features(features: Dict, feature_columns: List[str]) -> pd.DataFrame:
    """
    Prepara as features para previsão
    """
    df = pd.DataFrame([features])
    
    # Garante que todas as colunas necessárias estão presentes
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0
    
    return df[feature_columns]

def predict_churn(model_data: Dict, features: Dict) -> Dict:
    """
    Realiza a previsão de cancelamento
    """
    try:
        # Prepara as features
        X = prepare_features(features, model_data['feature_columns'])
        
        # Normaliza as features
        X_scaled = model_data['scaler'].transform(X)
        
        # Faz a previsão
        proba = model_data['model'].predict_proba(X_scaled)[0]
        
        # Identifica os principais fatores de risco
        feature_importance = dict(zip(
            model_data['feature_columns'],
            model_data['model'].feature_importances_
        ))
        
        # Ordena features por importância e valor absoluto
        risk_factors = []
        for feature, value in zip(model_data['feature_columns'], X_scaled[0]):
            importance = feature_importance[feature]
            risk_score = abs(value * importance)
            risk_factors.append({
                'feature': feature,
                'valor': float(value),
                'importance': float(importance),
                'risk_score': float(risk_score)
            })
        
        risk_factors.sort(key=lambda x: x['risk_score'], reverse=True)
        top_factors = risk_factors[:3]  # Top 3 fatores de risco
        
        return {
            'churn_probability': float(proba[1]),  # Probabilidade de cancelamento
            'principais_fatores': top_factors,
            'metadata': {
                'model_version': '1.0',
                'features_used': model_data['feature_columns'],
                'confidence_score': float(max(proba))
            }
        }
        
    except Exception as e:
        raise Exception(f"Erro ao fazer previsão: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description='Previsão de Cancelamento')
    parser.add_argument('--model_path', type=str, required=True,
                      help='Caminho para o modelo salvo')
    parser.add_argument('--features', type=str, required=True,
                      help='Features do aluno em formato JSON')
    
    args = parser.parse_args()
    
    try:
        # Carrega o modelo
        model_data = load_model(args.model_path)
        
        # Carrega as features
        features = json.loads(args.features)
        
        # Faz a previsão
        prediction = predict_churn(model_data, features)
        
        # Retorna o resultado
        print(json.dumps(prediction))
        
    except Exception as e:
        print(json.dumps({
            'error': str(e)
        }))
        exit(1)

if __name__ == '__main__':
    main() 