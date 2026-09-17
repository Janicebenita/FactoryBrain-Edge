import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib


np.random.seed(42)

ROWS_PER_CLASS = 1000


def make_samples(label):
    if label == "normal":
        return pd.DataFrame({
            "temperature": np.random.normal(65, 4, ROWS_PER_CLASS),
            "vibration": np.random.normal(2.0, 0.5, ROWS_PER_CLASS),
            "pressure": np.random.normal(5.2, 0.3, ROWS_PER_CLASS),
            "rpm": np.random.normal(2850, 50, ROWS_PER_CLASS),
            "motor_current": np.random.normal(9.5, 0.8, ROWS_PER_CLASS),
            "label": label
        })

    if label == "bearing_warning":
        return pd.DataFrame({
            "temperature": np.random.normal(82, 5, ROWS_PER_CLASS),
            "vibration": np.random.normal(7.0, 1.0, ROWS_PER_CLASS),
            "pressure": np.random.normal(4.8, 0.4, ROWS_PER_CLASS),
            "rpm": np.random.normal(2820, 70, ROWS_PER_CLASS),
            "motor_current": np.random.normal(12.5, 1.0, ROWS_PER_CLASS),
            "label": label
        })

    if label == "overheat":
        return pd.DataFrame({
            "temperature": np.random.normal(96, 5, ROWS_PER_CLASS),
            "vibration": np.random.normal(3.0, 0.8, ROWS_PER_CLASS),
            "pressure": np.random.normal(5.0, 0.4, ROWS_PER_CLASS),
            "rpm": np.random.normal(2830, 60, ROWS_PER_CLASS),
            "motor_current": np.random.normal(11.0, 1.0, ROWS_PER_CLASS),
            "label": label
        })

    if label == "pressure_anomaly":
        return pd.DataFrame({
            "temperature": np.random.normal(70, 5, ROWS_PER_CLASS),
            "vibration": np.random.normal(3.5, 0.8, ROWS_PER_CLASS),
            "pressure": np.random.normal(3.4, 0.4, ROWS_PER_CLASS),
            "rpm": np.random.normal(2800, 80, ROWS_PER_CLASS),
            "motor_current": np.random.normal(10.5, 1.0, ROWS_PER_CLASS),
            "label": label
        })


frames = [
    make_samples("normal"),
    make_samples("bearing_warning"),
    make_samples("overheat"),
    make_samples("pressure_anomaly"),
]

df = pd.concat(frames, ignore_index=True)

features = [
    "temperature",
    "vibration",
    "pressure",
    "rpm",
    "motor_current",
]

X = df[features]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=10,
    random_state=42,
)

model.fit(X_train, y_train)

pred = model.predict(X_test)

print(classification_report(y_test, pred))

joblib.dump(model, "models/pump_failure_model.joblib")

print("Model saved to models/pump_failure_model.joblib")