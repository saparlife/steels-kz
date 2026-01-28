FROM node:20-alpine

WORKDIR /app

RUN npm install @supabase/supabase-js typescript tsx

COPY download-images.ts .

CMD ["npx", "tsx", "download-images.ts"]
