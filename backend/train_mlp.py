import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib


np.random.seed(42)
torch.manual_seed(42)

ROWS_PER_CLASS = 1000

FEATURES = [
    "temperature",
    "vibration",
    "pressure",
    "rpm",
    "motor_current",
]

CLASSES = [
    "normal",
    "bearing_warning",
    "overheat",
    "pressure_anomaly",
]


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


frames = [make_samples(label) for label in CLASSES]
df = pd.concat(frames, ignore_index=True)

X = df[FEATURES].values.astype(np.float32)
y = df["label"].map({label: i for i, label in enumerate(CLASSES)}).values

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train).astype(np.float32)
X_test = scaler.transform(X_test).astype(np.float32)

joblib.dump(scaler, "models/mlp_scaler.joblib")


class PumpMLP(nn.Module):
    def __init__(self):
        super().__init__()

        self.net = nn.Sequential(
            nn.Linear(5, 16),
            nn.ReLU(),
            nn.Linear(16, 16),
            nn.ReLU(),
            nn.Linear(16, 4)
        )

    def forward(self, x):
        return self.net(x)


model = PumpMLP()

criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001
)

train_dataset = TensorDataset(
    torch.tensor(X_train),
    torch.tensor(y_train, dtype=torch.long)
)

train_loader = DataLoader(
    train_dataset,
    batch_size=64,
    shuffle=True
)

for epoch in range(50):
    model.train()

    total_loss = 0

    for xb, yb in train_loader:

        optimizer.zero_grad()

        logits = model(xb)

        loss = criterion(logits, yb)

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

    if (epoch + 1) % 10 == 0:
        print(
            f"Epoch {epoch + 1}/50 "
            f"Loss: {total_loss / len(train_loader):.4f}"
        )


model.eval()

with torch.no_grad():

    logits = model(
        torch.tensor(X_test)
    )

    predictions = torch.argmax(
        logits,
        dim=1
    ).numpy()

accuracy = (
    predictions == y_test
).mean()

print(f"Test accuracy: {accuracy:.4f}")

torch.save(
    model.state_dict(),
    "models/pump_mlp.pth"
)

print("Saved: models/pump_mlp.pth")
print("Saved: models/mlp_scaler.joblib")