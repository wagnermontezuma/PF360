import argparse
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from typing import Dict, List, Tuple

def prepare_training_data(features_json: str) -> Tuple[pd.DataFrame, np.ndarray]:
    """
    Prepara os dados para treinamento
    """
    try:
        # Carrega os dados
        data = json.loads(features_json)
        df = pd.DataFrame(data)
        
        # Separa features e target
        X = df.drop('cancelou', axis=1)
        y = df['cancelou']
        
        return X, y
        
    except Exception as e:
        raise Exception(f"Erro ao preparar dados: {str(e)}")

def train_model(X: pd.DataFrame, y: np.ndarray) -> Dict:
    """
    Treina o modelo de previsão de cancelamentos
    """
    try:
        # Normalização
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Split treino/teste
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Configuração do modelo
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )
        
        # Treinamento
        model.fit(X_train, y_train)
        
        # Validação cruzada
        cv_scores = cross_val_score(model, X_scaled, y, cv=5)
        
        # Avaliação no conjunto de teste
        y_pred = model.predict(X_test)
        
        # Métricas
        metrics = {
            'accuracy': float(cv_scores.mean()),
            'cv_std': float(cv_scores.std()),
            'classification_report': classification_report(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'feature_importance': dict(zip(
                X.columns.tolist(),
                model.feature_importances_.tolist()
            ))
        }
        
        return {
            'model': model,
            'scaler': scaler,
            'feature_columns': X.columns.tolist(),
            'metrics': metrics
        }
        
    except Exception as e:
        raise Exception(f"Erro ao treinar modelo: {str(e)}")

def save_model(model_data: Dict, model_path: str):
    """
    Salva o modelo treinado
    """
    try:
        joblib.dump(model_data, model_path)
    except Exception as e:
        raise Exception(f"Erro ao salvar modelo: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description='Treinamento do Modelo de Cancelamento')
    parser.add_argument('--features', type=str, required=True,
                      help='Dados de treinamento em formato JSON')
    parser.add_argument('--model_path', type=str, required=True,
                      help='Caminho para salvar o modelo')
    
    args = parser.parse_args()
    
    try:
        # Prepara os dados
        X, y = prepare_training_data(args.features)
        
        # Treina o modelo
        model_data = train_model(X, y)
        
        # Salva o modelo
        save_model(model_data, args.model_path)
        
        # Retorna as métricas
        print(json.dumps(model_data['metrics']))
        
    except Exception as e:
        print(json.dumps({
            'error': str(e)
        }))
        exit(1)

if __name__ == '__main__':
    main() 