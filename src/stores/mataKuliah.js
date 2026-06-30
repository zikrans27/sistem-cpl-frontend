import { defineStore } from "pinia";
import api from "@/api/axios";

export const useMataKuliahStore = defineStore("mataKuliah", {
  state: () => ({
    list: [],
    loading: false,
  }),
  getters: {
    filtered: (state) => (tipe, search) => {
      let result = state.list;
      if (tipe && tipe !== "all")
        result = result.filter((mk) => mk.tipe === tipe);
      if (search)
        result = result.filter((mk) =>
          mk.name.toLowerCase().includes(search.toLowerCase()),
        );
      return result;
    },
    getById: (state) => (id) => state.list.find((mk) => mk.id === Number(id)),
  },
  actions: {
    // Ambil data dari Laravel API
    async fetch() {
      this.loading = true;
      try {
        const res = await api.get("/mata-kuliah");
        this.list = res.data;
      } finally {
        this.loading = false;
      }
    },

    // Tetap dipertahankan untuk tambah lokal jika diperlukan
    async tambah({ name, tipe, tahun }) {
      const res = await api.post("/mata-kuliah", { name, tipe, tahun });
      this.list.push(res.data);
    },
    async edit(id, { name, tipe, tahun }) {
      const res = await api.put(`/mata-kuliah/${id}`, { name, tipe, tahun });
      const idx = this.list.findIndex((m) => m.id === id);
      if (idx !== -1) this.list[idx] = res.data;
    },
    async hapus(id) {
      await api.delete(`/mata-kuliah/${id}`);
      this.list = this.list.filter((m) => m.id !== id);
    },
  },
  persist: true,
});
