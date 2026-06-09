# Tech Store OOSE

Monorepo cho hệ thống Tech Store gồm:

- `frontend`: React + Vite
- `backend`: Spring Boot + Maven

## Yêu cầu môi trường

- Node.js 20+
- Java 25
- Maven 3.9+
- PostgreSQL

## Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`.

## Chạy backend

```bash
cd backend
mvn spring-boot:run
```

Backend mặc định chạy tại `http://localhost:8080`.

## Cấu trúc chính

```text
tech-store-oose/
  frontend/
    src/
      api/
      assets/
      components/
      features/
      hooks/
      layouts/
      pages/
      routes/
      styles/
      utils/
  backend/
    src/main/java/com/oose/tech_store/
      common/
      config/
      controller/
      dto/
      entity/
      exception/
      mapper/
      repository/
      security/
      service/
    src/main/resources/
      db/migration/
```
