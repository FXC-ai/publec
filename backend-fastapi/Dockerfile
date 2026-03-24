FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # venv “global” au conteneur
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:/root/.local/bin:${PATH}"

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*


# Installer uv uniquement dans l'image
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

WORKDIR /backend-fastapi

# Créer le venv dans l'image
RUN python -m venv /opt/venv

# Installer les dépendances (cache Docker friendly)
COPY pyproject.toml uv.lock* ./
RUN uv sync --active --frozen || uv sync --active

# Copier le code ensuite
COPY . .

EXPOSE 8000



CMD ["uv", "run", "--active", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
