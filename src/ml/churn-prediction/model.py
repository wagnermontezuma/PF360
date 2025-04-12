import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib
from typing import Dict, List, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChurnPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = [
            # Frequência
            'dias_desde_ultima_entrada',
            'media_entradas_semana',
            'total_faltas_30d',
            
            # Engajamento
            'taxa_conclusao_treinos',
            'media_duracao_treino',
            'variedade_exercicios',
            
            # Financeiro
            'atrasos_pagamento_6m',
            'valor_mensalidade',
            'tempo_cliente_meses',
            
            # Satisfação
            'nota_media_aulas',
            'nota_media_instrutores',
            'nota_media_estrutura',
            
            # Progresso
            'taxa_evolucao_carga',
            'metas_alcancadas',
            'avaliacoes_realizadas'
        ]

    def preprocess_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Pré-processa os dados para treinamento ou inferência
        """
        X = df[self.feature_columns]
        y = df['cancelou'] if 'cancelou' in df.columns else None
        
        # Tratamento de valores nulos
        X = X.fillna(X.mean())
        
        # Normalização
        X = self.scaler.fit_transform(X) if y is not None else self.scaler.transform(X)
        
        return X, y

    def train(self, train_data: pd.DataFrame) -> Dict:
        """
        Treina o modelo de previsão de cancelamentos
        """
        logger.info("Iniciando treinamento do modelo...")
        
        X, y = self.preprocess_data(train_data)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )

        self.model.fit(X_train, y_train)
        
        # Avaliação
        y_pred = self.model.predict(X_test)
        
        metrics = {
            'classification_report': classification_report(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'feature_importance': dict(zip(self.feature_columns, 
                                        self.model.feature_importances_))
        }
        
        logger.info("Treinamento concluído com sucesso")
        return metrics

    def predict(self, data: pd.DataFrame) -> Dict:
        """
        Realiza previsões de probabilidade de cancelamento
        """
        if self.model is None:
            raise ValueError("Modelo não treinado. Execute o método train() primeiro.")
            
        X, _ = self.preprocess_data(data)
        
        # Probabilidades de cancelamento
        probs = self.model.predict_proba(X)
        
        # Feature importance para explicabilidade
        feature_importance = dict(zip(self.feature_columns, 
                                    self.model.feature_importances_))
        
        return {
            'churn_probability': probs[:, 1].tolist(),
            'feature_importance': feature_importance
        }

    def save_model(self, path: str):
        """
        Salva o modelo treinado
        """
        if self.model is None:
            raise ValueError("Não há modelo para salvar")
            
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns
        }, path)
        logger.info(f"Modelo salvo em {path}")

    def load_model(self, path: str):
        """
        Carrega um modelo salvo
        """
        saved_data = joblib.load(path)
        self.model = saved_data['model']
        self.scaler = saved_data['scaler']
        self.feature_columns = saved_data['feature_columns']
        logger.info(f"Modelo carregado de {path}")

    def get_risk_factors(self, data: pd.DataFrame) -> List[Dict]:
        """
        Identifica os principais fatores de risco para cancelamento
        """
        if self.model is None:
            raise ValueError("Modelo não treinado")
            
        X, _ = self.preprocess_data(data)
        predictions = self.predict(data)
        
        risk_factors = []
        for idx, prob in enumerate(predictions['churn_probability']):
            if prob > 0.5:  # Alto risco de cancelamento
                # Identifica features mais importantes para a previsão
                feature_values = dict(zip(self.feature_columns, X[idx]))
                sorted_features = sorted(
                    feature_values.items(),
                    key=lambda x: abs(x[1]),
                    reverse=True
                )[:3]  # Top 3 fatores
                
                risk_factors.append({
                    'aluno_id': data.index[idx],
                    'probabilidade_cancelamento': prob,
                    'principais_fatores': [
                        {'feature': f, 'valor': v}
                        for f, v in sorted_features
                    ]
                })
                
        return risk_factors 