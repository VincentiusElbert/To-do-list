DEPLOYMENT: https://to-do-list-elbert.vercel.app/

MVP Guide - TodoList Frontend 
 
Tujuan 
Mentee membangun Frontend MVP TodoList yang terhubung dengan backend be_todolist. 
Backend bisa dijalankan dengan: 
   
git clone https://github.com/Henryrivardo07/be_todolist.git, jangan lupa 
di NPM I ya 
 
 
Tech Stack Wajib 
• React.js + TypeScript → framework & type safety 
• Tailwind CSS → styling cepat 
• shadcn/ui → komponen UI 
• Redux Toolkit → menyimpan filter & state UI 
• TanStack Query (React Query) → data fetching & caching 
• Optimistic UI → UX responsif, update tanpa tunggu server 
• Day.js → format tanggal 
 
API 
 
GET /todos 
• Untuk pagination biasa (page, limit). 
• Response: todos, totalTodos, hasNextPage, nextPage. 
 
GET /todos/scroll 
• Untuk infinite scroll (lazy load). 
• Query: completed, priority, dateGte, dateLte, sort, order, nextCursor, limit. 
• Response: todos, nextCursor, hasNextPage. 
 
POST /todos 
• Buat todo baru. Body: { title, completed?, date?, priority? }. 
 
PUT /todos/:id 
• Update todo (title, completed, date, priority). 
 
DELETE /todos/:id 
• Hapus todo. 
 
MVP Features 
1. List Todos 
o Tampilkan title, date, priority, status. 
o Badge warna untuk priority. 
o Format tanggal rapi. 
2. Add Todo 
o Input: title, priority, date. 
o Setelah submit → langsung muncul (optimistic). 
o Rollback jika gagal. 
3. Toggle Completed 
o Checkbox di setiap todo. 
o Optimistic toggle. 
4. Delete Todo 
o Tombol hapus. 
o Optimistic delete. 
5. Filter 
o By completed (all/active/completed). 
o By priority (low/medium/high). 
o By date range (gte/lte). 
6. Sort 
o By date atau priority. 
o Order asc/desc. 
7. Pagination 
o Versi A: paging dengan page & limit. 
o Versi B: Infinite Scroll (pakai /todos/scroll). 
8. Infinite Scroll 
o Fetch batch pertama (nextCursor=0). 
o Saat user scroll ke bawah → fetch batch berikutnya. 
o Hentikan jika nextCursor=null. 
 
State Management 
• Redux Toolkit 
o Simpan filter: completed, priority, dateGte, dateLte, sort, order. 
o Simpan view mode: "page" atau "scroll". 
• TanStack Query 
o Query: list todos (pagination atau scroll). 
o Mutations: add, toggle, delete. 
 
User Flow 
1. User membuka halaman → fetch list awal (10 item). 
2. Scroll ke bawah → load lebih banyak (scroll mode). 
3. Add todo → muncul instan di atas list (optimistic). 
4. Toggle completed → update instan. 
5. Delete todo → langsung hilang. 
6. Ubah filter/sort → reset list, fetch ulang dari awal. 
7. Jika hasil kosong → tampilkan empty state. 
 
UI/UX Guidelines 
• List Card: 
o Kiri: checkbox + title 
o Bawah: tanggal + badge priority 
o Kanan: tombol delete 
• Filter Bar: 
o Dropdown priority, completed, sort, order 
o Input date range 
o Tombol reset 
• Infinite Scroll: sentinel div di bawah list 
• Feedback: 
o Skeleton saat load awal 
o Spinner saat load batch berikutnya 
o Toast error jika fetch gagal 
 
Acceptance Criteria 
• Todos muncul dari backend. 
• Bisa tambah, toggle, delete (optimistic). 
• Filter priority/completed/date jalan. 
• Sort by date/priority jalan. 
• Pagination & infinite scroll bekerja. 
• UI minimalis dark mode dengan Tailwind + shadcn. 
• Ada loading, empty, dan error state. 
