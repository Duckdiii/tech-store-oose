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

## Cấu hình Supabase

Backend đã được cấu hình để đọc kết nối PostgreSQL từ file `backend/.env`.

Các biến đang dùng:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

File mẫu nằm ở `backend/.env.example`.

JDBC URL được dựng theo mẫu:

```text
jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require
```

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
