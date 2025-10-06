FROM python:3.12-slim

# Avoid Python writing .pyc files and ensure stdout/stderr are unbuffered
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Create non-root user for better security
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app

# Install dependencies first for better caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app

# App runs on 8001 (see uvicorn command below)
EXPOSE 8001

# Environment configuration (can be overridden at runtime)
ENV PORT=8001

USER appuser

# Start FastAPI with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]


