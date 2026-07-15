<template>
  <AppLayout :navItems="navItems" userName="Admin">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <RouterLink to="/admin/dashboard" class="back-btn">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Kembali
      </RouterLink>
      <div class="page-title-wrap">
        <h1>{{ mk?.name || "Tabel Penilaian" }}</h1>
        <div class="subtitle">{{ mk?.semester || "Semester Aktif" }}</div>
      </div>
      <RouterLink
        :to="`/admin/hasil-cpl/${mkId}`"
        class="btn btn-primary hasil-cpl-btn"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="width: 16px; height: 16px"
        >
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
        Lihat Hasil Pengukuran CPL
      </RouterLink>
    </div>

    <!-- ADMIN TOOLBAR -->
    <div class="admin-toolbar">
      <button class="btn btn-dark" @click="toggleManageMode">
        {{ manageMode ? "❌ Batal" : "⚙️ Edit Mode" }}
      </button>
      <button class="btn btn-primary" @click="openModal('cpl')">
        <span class="icon-plus">+</span> Tambah CPL
      </button>
      <button class="btn btn-orange" @click="openModalCPMK">
        <span class="icon-plus">+</span> Tambah CPMK
      </button>
      <button class="btn btn-green" @click="openModalSubCPMK">
        <span class="icon-plus">+</span> Tambah Sub-CPMK &amp; Bobot
      </button>
    </div>

    <!-- TABLE WRAPPER -->
    <div class="wrapper">
      <div class="table-header">
        <h2>Tabel Penilaian</h2>
        <span class="badge">{{ data.cplList.length }} CPL</span>
        <span class="badge">{{ totalCPMK }} CPMK</span>
        <span class="badge">{{ totalSubCPMK }} Sub-CPMK</span>

        <!-- ROW CONTROLS: hanya muncul saat Edit Mode aktif -->
        <div class="row-controls" v-if="manageMode">
          <span class="row-controls-label">Jumlah Baris</span>
          <input
            type="number"
            min="1"
            v-model.number="jumlahBarisInput"
            class="row-count-input"
            placeholder="1"
          />
          <button class="btn btn-secondary btn-sm" @click="addMahasiswaRow">
            <span class="icon-plus">+</span> Tambah Baris
          </button>
          <button class="btn btn-secondary btn-sm" @click="removeLastRow">
            <span class="icon-minus">−</span> Hapus Baris
          </button>
        </div>
      </div>

      <div class="table-scroll">
        <table>
          <thead>
            <!-- ROW 1: CPL -->
            <tr class="meta-row">
              <td colspan="3" class="label-cell">CPL</td>
              <template v-for="(cpl, ci) in data.cplList" :key="'cpl-hd-' + ci">
                <td
                  :colspan="cplTotalSpan(ci)"
                  style="border-left: 4px solid #000; text-align: center"
                >
                  {{ cpl.name }}
                  <template v-if="manageMode">
                    <!-- Edit button — ganti semua ✏️ dengan ini -->
                    <button class="edit-btn" @click.stop="editCPL(ci)">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path
                          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                        />
                      </svg>
                    </button>

                    <!-- Delete button — ganti semua 🗑️ dengan ini -->
                    <button class="delete-btn" @click.stop="deleteCPL(ci)">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path
                          d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                        />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </template>
                </td>
              </template>
            </tr>

            <!-- ROW 2: CPMK -->
            <tr class="meta-row">
              <td colspan="3" class="label-cell">CPMK</td>
              <template
                v-for="(cpl, ci) in data.cplList"
                :key="'cpmk-hd-' + ci"
              >
                <template v-if="isCplEmpty(ci)">
                  <td class="empty-cell">—</td>
                </template>
                <template v-else>
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'cpmk-hd-' + ci + '-' + mi"
                  >
                    <td
                      :colspan="cpmkTotalSpan(ci, mi)"
                      :style="`border-left:${mi === 0 ? '4px' : '3px'} solid ${
                        mi === 0 ? '#000' : 'rgba(0,0,0,0.7)'
                      };text-align:center;`"
                    >
                      {{ cpmk.name }} ({{ cpmk.persen }}%)
                      <template v-if="manageMode">
                        <!-- Edit button — hanya edit CPMK ini -->
                        <button class="edit-btn" @click.stop="editCPMK(ci, mi)">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path
                              d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                            />
                          </svg>
                        </button>

                        <!-- Delete button — hanya hapus CPMK ini -->
                        <button class="delete-btn" @click.stop="deleteCPMK(ci, mi)">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path
                              d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                            />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </template>
                    </td>
                  </template>
                </template>
              </template>
            </tr>

            <!-- ROW 3: Sub-CPMK -->
            <tr class="subcpmk-row">
              <td colspan="3" class="row-label">Sub-CPMK</td>
              <template v-for="(cpl, ci) in data.cplList" :key="'sub-hd-' + ci">
                <template v-if="isCplEmpty(ci)">
                  <td class="empty-cell">—</td>
                </template>
                <template v-else>
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'sub-hd-cpmk-' + ci + '-' + mi"
                  >
                    <template
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'sub-hd-sub-' + ci + '-' + mi + '-' + si"
                    >
                      <td
                        v-if="sub.bobotItems.length > 0"
                        :colspan="sub.bobotItems.length"
                        :style="`${subBorderStyle(mi, si)}background:${
                          subColor(ci, mi, si).bg
                        };color:${subColor(ci, mi, si).text};font-weight:700;`"
                      >
                        {{ sub.name }}
                        <template v-if="manageMode">
                          <!-- Edit button — hanya edit Sub-CPMK ini -->
                          <button class="edit-btn" @click.stop="editSubCPMK(ci, mi, si)">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path
                                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                              />
                            </svg>
                          </button>

                          <!-- Delete button — hanya hapus Sub-CPMK ini -->
                          <button
                            class="delete-btn"
                            @click.stop="deleteSubCPMK(ci, mi, si)"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path
                                d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                              />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path
                                d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                              />
                            </svg>
                          </button>
                        </template>
                      </td>
                    </template>
                    <td v-if="isCpmkEmpty(ci, mi)" class="empty-cell">—</td>
                  </template>
                </template>
              </template>
            </tr>

            <!-- ROW 4: Total Bobot -->
            <tr class="bobot-row">
              <td colspan="3" class="row-label">Total Bobot</td>
              <template v-for="(cpl, ci) in data.cplList" :key="'tb-hd-' + ci">
                <template v-if="isCplEmpty(ci)">
                  <td class="empty-cell">—</td>
                </template>
                <template v-else>
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'tb-cpmk-' + ci + '-' + mi"
                  >
                    <template
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'tb-sub-' + ci + '-' + mi + '-' + si"
                    >
                      <td
                        v-if="sub.bobotItems.length > 0"
                        :colspan="sub.bobotItems.length"
                        class="big-bobot"
                        :style="subBorderStyle(mi, si)"
                      >
                        {{ sub.totalBobot }}
                        <template v-if="manageMode">
                          <!-- Edit button — edit Total Bobot Sub-CPMK ini -->
                          <button class="edit-btn" @click.stop="editSubCPMK(ci, mi, si)">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path
                                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                              />
                            </svg>
                          </button>

                          <!-- Delete button — hapus Sub-CPMK ini -->
                          <button
                            class="delete-btn"
                            @click.stop="deleteSubCPMK(ci, mi, si)"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path
                                d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                              />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path
                                d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                              />
                            </svg>
                          </button>
                        </template>
                      </td>
                    </template>
                    <td v-if="isCpmkEmpty(ci, mi)" class="empty-cell">—</td>
                  </template>
                </template>
              </template>
            </tr>

            <!-- ROW 5: Bobot per kolom -->
            <tr class="bobot-row">
              <td colspan="3" class="row-label">Bobot</td>
              <template v-for="(cpl, ci) in data.cplList" :key="'b-hd-' + ci">
                <template v-if="isCplEmpty(ci)">
                  <td class="empty-cell">—</td>
                </template>
                <template v-else>
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'b-cpmk-' + ci + '-' + mi"
                  >
                    <template
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'b-sub-' + ci + '-' + mi + '-' + si"
                    >
                      <template
                        v-for="(b, bi) in sub.bobotItems"
                        :key="'b-item-' + ci + '-' + mi + '-' + si + '-' + bi"
                      >
                        <td :style="colBorderStyle(ci, mi, si, bi)">
                          {{ b.bobot }}
                          <template v-if="manageMode">
                            <!-- Edit button — edit komponen bobot ini -->
                            <button class="edit-btn" @click.stop="editKomponen(ci, mi, si, bi)">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M12 20h9" />
                                <path
                                  d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                                />
                              </svg>
                            </button>

                            <!-- Delete button — hapus komponen bobot ini -->
                            <button
                              class="delete-btn"
                              @click.stop="deleteKomponen(ci, mi, si, bi)"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path
                                  d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                                />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path
                                  d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                                />
                              </svg>
                            </button>
                          </template>
                        </td>
                      </template>
                    </template>
                    <td v-if="isCpmkEmpty(ci, mi)" class="empty-cell">—</td>
                  </template>
                </template>
              </template>
            </tr>

            <!-- ROW 6: Column headers -->
            <tr class="col-header">
              <th class="left" style="width: 50px">No.</th>
              <th style="width: 140px">NIM</th>
              <th class="left" style="width: 220px">Nama</th>
              <template v-for="(cpl, ci) in data.cplList" :key="'ch-' + ci">
                <template v-if="isCplEmpty(ci)">
                  <th
                    style="font-style: italic; font-weight: 400; opacity: 0.5"
                  >
                    —
                  </th>
                </template>
                <template v-else>
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'ch-cpmk-' + ci + '-' + mi"
                  >
                    <template
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'ch-sub-' + ci + '-' + mi + '-' + si"
                    >
                      <template
                        v-for="(b, bi) in sub.bobotItems"
                        :key="'ch-b-' + ci + '-' + mi + '-' + si + '-' + bi"
                      >
                        <th :style="colBorderStyle(ci, mi, si, bi)">
                          {{ b.label || b.nama }}
                          <!-- Ganti semua ⤸ dengan ini -->
                          <button
                            class="fill-column-btn"
                            @click="isiSemuaKolom(ci, mi, si, bi)"
                            title="Isi semua mahasiswa"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M12 5v14" />
                              <path d="M5 12l7 7 7-7" />
                              <path d="M5 5h14" />
                            </svg>
                          </button>
                          <template v-if="manageMode">
                            <!-- Edit button — edit komponen bobot ini -->
                            <button class="edit-btn" @click.stop="editKomponen(ci, mi, si, bi)">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M12 20h9" />
                                <path
                                  d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                                />
                              </svg>
                            </button>

                            <!-- Delete button — hapus komponen bobot ini -->
                            <button
                              class="delete-btn"
                              @click.stop="deleteKomponen(ci, mi, si, bi)"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path
                                  d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                                />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path
                                  d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                                />
                              </svg>
                            </button>
                          </template>
                        </th>
                      </template>
                    </template>
                    <th
                      v-if="isCpmkEmpty(ci, mi)"
                      style="font-style: italic; font-weight: 400; opacity: 0.5"
                    >
                      —
                    </th>
                  </template>
                </template>
              </template>
            </tr>
          </thead>
          <tbody>
            <!-- DATA ROWS -->
            <tr v-for="(mhs, rowIdx) in data.mahasiswa" :key="'row-' + rowIdx">
              <td class="no">{{ rowIdx + 1 }}</td>
              <td class="nim">
                <input
                  type="text"
                  v-model="data.mahasiswa[rowIdx].nim"
                  placeholder="NIM"
                  @change="saveData"
                  style="color: #5c6bc0; font-family: 'DM Mono', monospace"
                />
              </td>
              <td class="nama">
                <input
                  type="text"
                  class="nama-input"
                  v-model="data.mahasiswa[rowIdx].nama"
                  placeholder="Nama"
                  @change="saveData"
                />
              </td>
              <template
                v-for="(cpl, ci) in data.cplList"
                :key="'dr-cpl-' + rowIdx + '-' + ci"
              >
                <template v-if="isCplEmpty(ci)">
                  <td class="empty-cell">—</td>
                </template>
                <template v-else>
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'dr-cpmk-' + rowIdx + '-' + ci + '-' + mi"
                  >
                    <template
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'dr-sub-' + rowIdx + '-' + ci + '-' + mi + '-' + si"
                    >
                      <template
                        v-for="(b, bi) in sub.bobotItems"
                        :key="
                          'dr-b-' +
                          rowIdx +
                          '-' +
                          ci +
                          '-' +
                          mi +
                          '-' +
                          si +
                          '-' +
                          bi
                        "
                      >
                        <td :style="colBorderStyle(ci, mi, si, bi)">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            :value="
                              data.mahasiswa[rowIdx].nilai[
                                nilaiKey(ci, mi, si, bi)
                              ] ?? ''
                            "
                            @change="
                              (e) =>
                                setNilai(rowIdx, ci, mi, si, bi, e.target.value)
                            "
                            placeholder="—"
                          />
                        </td>
                      </template>
                    </template>
                    <td v-if="isCpmkEmpty(ci, mi)" class="empty-cell">—</td>
                  </template>
                </template>
              </template>
            </tr>

            <!-- RATA-RATA ROW -->
            <tr class="avg-row">
              <td colspan="3" class="label">Rata-rata</td>
              <template
                v-for="(cpl, ci) in data.cplList"
                :key="'avg-cpl-' + ci"
              >
                <template v-if="isCplEmpty(ci)">
                  <td>—</td>
                </template>
                <template v-else>
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'avg-cpmk-' + ci + '-' + mi"
                  >
                    <template
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'avg-sub-' + ci + '-' + mi + '-' + si"
                    >
                      <template
                        v-for="(b, bi) in sub.bobotItems"
                        :key="'avg-b-' + ci + '-' + mi + '-' + si + '-' + bi"
                      >
                        <td :style="colBorderStyle(ci, mi, si, bi)">
                          {{ avgNilai(ci, mi, si, bi) }}
                        </td>
                      </template>
                    </template>
                    <td v-if="isCpmkEmpty(ci, mi)">—</td>
                  </template>
                </template>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- end table-scroll -->

      <!-- ══ ANALISIS SUB-CPMK ══ -->
      <div class="analysis-card" style="margin: 20px">
        <div class="analysis-title">Rekap hasil ukur pencapaian Sub-CPMK</div>
        <div class="modern-table-wrap">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Sub-CPMK</th>
                <th v-for="k in komponenHeaders" :key="'kh-' + k">{{ k }}</th>
                <th>Total Bobot yang Diperoleh</th>
                <th>Bobot Maksimum</th>
                <th>Skala Pencapaian</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(cpl, ci) in data.cplList" :key="'as-cpl-' + ci">
                <template
                  v-for="(cpmk, mi) in cpl.cpmkList"
                  :key="'as-cpmk-' + ci + '-' + mi"
                >
                  <tr
                    v-for="(sub, si) in cpmk.subCpmkList"
                    :key="'as-sub-' + ci + '-' + mi + '-' + si"
                  >
                    <td>{{ sub.name }}</td>
                    <td v-for="kNama in komponenHeaders" :key="'as-k-' + kNama">
                      {{ nilaiKomponenSub(ci, mi, si, kNama) }}
                    </td>
                    <td>{{ totalKomponenSub(ci, mi, si).toFixed(1) }}</td>
                    <td>{{ sub.totalBobot }}</td>
                    <td>{{ skalaSub(ci, mi, si) }}%</td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ══ TABEL REKAP STANDAR SUB-CPMK ══ -->
      <div class="analysis-card" style="margin: 20px">
        <div class="analysis-title">
          Rekap hasil pengukuran Sub-CPMK dan disajikan dalam bentuk chart
        </div>
        <div class="modern-table-wrap">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Keterangan</th>
                <template
                  v-for="(cpl, ci) in data.cplList"
                  :key="'ssh-cpl-' + ci"
                >
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'ssh-cpmk-' + ci + '-' + mi"
                  >
                    <th
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'ssh-sub-' + ci + '-' + mi + '-' + si"
                    >
                      {{ sub.name }}
                    </th>
                  </template>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hasil Pengukuran</td>
                <template
                  v-for="(cpl, ci) in data.cplList"
                  :key="'hp-cpl-' + ci"
                >
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'hp-cpmk-' + ci + '-' + mi"
                  >
                    <td
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'hp-' + ci + '-' + mi + '-' + si"
                    >
                      {{ skalaSub(ci, mi, si) }}%
                    </td>
                  </template>
                </template>
              </tr>
              <tr>
                <td>Standar Pencapaian</td>
                <template
                  v-for="(cpl, ci) in data.cplList"
                  :key="'sp-cpl-' + ci"
                >
                  <template
                    v-for="(cpmk, mi) in cpl.cpmkList"
                    :key="'sp-cpmk-' + ci + '-' + mi"
                  >
                    <td
                      v-for="(sub, si) in cpmk.subCpmkList"
                      :key="'sp-' + ci + '-' + mi + '-' + si"
                    >
                      <input
                        type="number"
                        :value="sub.standar || 80"
                        @change="
                          (e) => setStandarSub(ci, mi, si, e.target.value)
                        "
                        placeholder="Standar"
                        class="standar-input"
                      />
                    </td>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CHART: Sub-CPMK (Radar) -->
      <div class="chart-box" style="margin: 20px; padding: 20px">
        <canvas ref="subCpmkChartRef" style="height: 350px !important"></canvas>
      </div>

      <!-- ══ TABEL CPMK ══ -->
      <div class="analysis-card" style="margin: 20px">
        <div class="analysis-title">
          Rekap hasil pengukuran CPMK berdasarkan hasil pengukuran Sub-CPMK dan
          disajikan dalam bentuk chart
        </div>
        <div class="modern-table-wrap">
          <table class="modern-table">
            <thead>
              <tr>
                <th>CPMK</th>
                <th v-for="s in allSubNames" :key="'csh-' + s">{{ s }}</th>
                <th>Nilai Rata-rata</th>
                <th>Kategori</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(cpl, ci) in data.cplList" :key="'ct-cpl-' + ci">
                <tr
                  v-for="(cpmk, mi) in cpl.cpmkList"
                  :key="'ct-' + ci + '-' + mi"
                >
                  <td>{{ cpmk.name }}</td>
                  <td
                    v-for="subHeader in allSubNames"
                    :key="'ctd-' + subHeader"
                  >
                    {{ nilaiSubDalamCPMK(ci, mi, subHeader) }}
                  </td>
                  <td>{{ rataCPMK(ci, mi).toFixed(2) }}</td>
                  <td>
                    <input
                      type="text"
                      :value="getKategoriCPMK(ci, mi)"
                      @change="(e) => setKategoriCPMK(ci, mi, e.target.value)"
                      placeholder="Kategori"
                      class="kategori-input"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CHART: CPMK (Bar) -->
      <div class="chart-container" style="margin: 20px; height: 350px">
        <canvas ref="cpmkChartRef"></canvas>
      </div>

      <!-- ══ TABEL CPL ══ -->
      <div class="analysis-card" style="margin: 20px">
        <div class="analysis-title">
          Rekap hasil pengukuran CPL beban mata kuliah berdasarkan hasil
          pengukuran CPMK dan disajikan dalam bentuk chart
        </div>
        <div class="modern-table-wrap">
          <table class="modern-table">
            <thead>
              <tr>
                <th>CPL</th>
                <th v-for="c in allCPMKNames" :key="'cplh-' + c">{{ c }}</th>
                <th>Nilai Rata-rata</th>
                <th>Kategori</th>
                <th>Standar Pencapaian</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cpl, ci) in data.cplList" :key="'cplt-' + ci">
                <td>{{ cpl.name }}</td>
                <td
                  v-for="cpmkHeader in allCPMKNames"
                  :key="'cpltd-' + cpmkHeader"
                >
                  {{ nilaiCPMKDalamCPL(ci, cpmkHeader) }}
                </td>
                <td>{{ rataCPL(ci).toFixed(2) }}</td>
                <td>
                  <input
                    type="text"
                    :value="getKategoriCPL(ci)"
                    @change="(e) => setKategoriCPL(ci, e.target.value)"
                    placeholder="Kategori"
                    class="kategori-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    :value="getStandarCPL(ci)"
                    @change="(e) => setStandarCPL(ci, e.target.value)"
                    placeholder="Standar"
                    class="standar-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CHART: CPL (Bar) -->
      <div class="chart-container" style="margin: 20px; height: 350px">
        <canvas ref="cplChartRef"></canvas>
      </div>

      <!-- CHART: CPL vs Standar (Bar) -->
      <div class="chart-box" style="margin: 20px; padding: 20px">
        <canvas
          ref="cplStandarChartRef"
          style="height: 350px !important"
        ></canvas>
      </div>
    </div>
    <!-- end .wrapper -->

    <!-- ══ MODAL: Tambah CPL ══ -->
    <div class="modal-overlay" :class="{ show: modal.cpl }">
      <div class="modal">
        <h3>Tambah CPL Baru</h3>
        <label>Jumlah CPL</label>
        <div class="input-prefix-group">
          <span class="input-prefix">CPL</span>
          <input
            type="number"
            v-model.number="modalData.cplJumlah"
            placeholder="cth: 2"
            min="1"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal('cpl')">
            Batal
          </button>
          <button class="btn btn-primary" @click="handleAddCPL">Simpan</button>
        </div>
      </div>
    </div>

    <!-- ══ MODAL: Tambah CPMK ══ -->
    <div class="modal-overlay" :class="{ show: modal.cpmk }">
      <div class="modal">
        <h3>Tambah CPMK Baru</h3>
        <label>Pilih CPL</label>
        <select v-model.number="modalData.cpmkCplIndex">
          <option
            v-for="(cpl, i) in data.cplList"
            :key="'cpl-opt-' + i"
            :value="i"
          >
            {{ cpl.name }}
          </option>
        </select>
        <div class="info-badge" :class="sisaPersen > 0 ? 'warn' : 'ok'">
          Sisa: {{ sisaPersen }}% dari 100%
        </div>
        <label>Jumlah CPMK</label>
        <div class="input-prefix-group">
          <span class="input-prefix">CPMK</span>
          <input
            type="number"
            v-model.number="modalData.cpmkJumlah"
            placeholder="cth: 2"
            min="1"
            @input="generatePersenInputs"
          />
        </div>
        <div
          v-for="(p, i) in modalData.cpmkPersenList"
          :key="'persen-' + i"
          style="margin-bottom: 10px"
        >
          <label>Persentase CPMK {{ i + 1 }}</label>
          <input
            type="number"
            v-model.number="modalData.cpmkPersenList[i]"
            placeholder="cth: 20"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal('cpmk')">
            Batal
          </button>
          <button class="btn btn-orange" @click="handleAddCPMK">Simpan</button>
        </div>
      </div>
    </div>

    <!-- ══ MODAL: Tambah Sub-CPMK ══ -->
    <div class="modal-overlay" :class="{ show: modal.subCpmk }">
      <div class="modal" style="max-height: 90vh; overflow-y: auto">
        <h3>Tambah Sub-CPMK &amp; Komponen Bobot</h3>
        <label>Pilih CPMK</label>
        <select v-model="modalData.subCpmkTarget">
          <template
            v-for="(cpl, ci) in data.cplList"
            :key="'sub-opt-cpl-' + ci"
          >
            <option
              v-for="(cpmk, mi) in cpl.cpmkList"
              :key="'sub-opt-' + ci + '_' + mi"
              :value="ci + '_' + mi"
            >
              {{ cpl.name }} → {{ cpmk.name }}
            </option>
          </template>
        </select>
        <label>Jumlah Sub-CPMK</label>
        <div class="input-prefix-group">
          <span class="input-prefix">Sub-CPMK</span>
          <input
            type="number"
            v-model.number="modalData.subJumlah"
            min="1"
            @input="generateSubInputs"
          />
        </div>
        <div
          v-for="(sub, i) in modalData.subList"
          :key="'sub-box-' + i"
          class="sub-box"
          :class="{ open: sub.open }"
        >
          <div class="sub-header" @click="sub.open = !sub.open">
            <span>Sub-CPMK {{ i + 1 }}</span>
            <span class="arrow">▶</span>
          </div>
          <div class="sub-content">
            <label>Total Bobot</label>
            <input
              type="number"
              v-model.number="sub.totalBobot"
              placeholder="cth: 20"
            />
            <div
              v-for="(k, ki) in sub.komponen"
              :key="'k-' + i + '-' + ki"
              class="komponen-item"
            >
              <select v-model="sub.komponen[ki].nama">
                <option v-for="nama in KOMPONEN_LIST" :key="nama" :value="nama">
                  {{ nama }}
                </option>
              </select>
              <input
                type="number"
                v-model.number="sub.komponen[ki].bobot"
                placeholder="Bobot"
              />
              <button
                class="remove-komponen"
                @click="sub.komponen.splice(ki, 1)"
              >
                ×
              </button>
            </div>
            <button
              class="btn-add-komponen"
              @click="sub.komponen.push({ nama: KOMPONEN_LIST[0], bobot: 0 })"
            >
              + Tambah Komponen
            </button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal('subCpmk')">
            Batal
          </button>
          <button class="btn btn-green" @click="handleAddSubCPMK">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import { useMataKuliahStore } from "@/stores/mataKuliah";
import Chart from "chart.js/auto";
import api from "@/api/axios";

// ── CONSTANTS ──
const KOMPONEN_LIST = [
  "PARTISIPASI",
  "QUIS",
  "TUGAS",
  "TUGAS PRESENTASI",
  "UNJUK KERJA",
  "LAPORAN",
  "UTS",
  "UAS",
];

const SUB_COLORS = [
  { bg: "#fff4ef", accent: "#f97316", text: "#f97316" },
  { bg: "#fffbe8", accent: "#eab308", text: "#92680a" },
  { bg: "#f0fdf4", accent: "#16a34a", text: "#166534" },
  { bg: "#eff6ff", accent: "#3b82f6", text: "#1e40af" },
  { bg: "#fdf4ff", accent: "#a855f7", text: "#7e22ce" },
  { bg: "#fff1f2", accent: "#f43f5e", text: "#be123c" },
];

const CPL_COLORS = [
  "#9B1530",
  "#3b82f6",
  "#16a34a",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
];

// ── ROUTE & STORE ──
const route = useRoute();
const mkStore = useMataKuliahStore();
const mkId = route.params.id || "1";
const mk = computed(() => mkStore.getById(mkId));
const STORAGE_KEY = `admin_tabel_${mkId}`;

// ── SIDEBAR NAV ──
const navItems = [
  {
    to: "/admin/dashboard",
    label: "Halaman Utama",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    to: "/admin/dashboard",
    label: "Mata Kuliah",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  },
];

// ── STATE ──
const manageMode = ref(false);

// Jumlah baris yang akan ditambah/dihapus (input di dekat tabel, aktif saat Edit Mode)
const jumlahBarisInput = ref(1);

function getDefaultData() {
  return {
    cplList: [],
    mahasiswa: [{ nim: "", nama: "", nilai: {} }],
    kategoriCPMK: {},
    kategoriCPL: {},
    standarCPL: {},
  };
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return getDefaultData();
}

const data = reactive(loadData());

async function saveData() {
  // Tetap simpan ke localStorage sebagai backup
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  try {
    // Simpan struktur CPL/CPMK/Sub-CPMK
    await api.post(`/penilaian/${mkId}/struktur`, {
      struktur: {
        cplList: data.cplList,
        kategoriCPMK: data.kategoriCPMK,
        kategoriCPL: data.kategoriCPL,
        standarCPL: data.standarCPL,
      },
    });

    // Simpan nilai mahasiswa
    await api.post(`/penilaian/${mkId}/nilai`, {
      mahasiswa: data.mahasiswa,
    });
  } catch (e) {
    console.log("Gagal simpan ke API:", e.message);
  }
}

function getNilaiHuruf(angka) {
  if (angka >= 85) return "A";
  if (angka >= 75) return "B";
  if (angka >= 65) return "C";
  if (angka >= 55) return "D";
  return "E";
}

// ── MODAL STATE ──
const modal = reactive({ cpl: false, cpmk: false, subCpmk: false });
const modalData = reactive({
  cplJumlah: 1,
  cpmkCplIndex: 0,
  cpmkJumlah: 1,
  cpmkPersenList: [0],
  subCpmkTarget: "",
  subJumlah: 1,
  subList: [],
});

function openModal(name) {
  modal[name] = true;
}
function closeModal(name) {
  modal[name] = false;
}

function openModalCPMK() {
  modalData.cpmkCplIndex = 0;
  modal.cpmk = true;
}

function openModalSubCPMK() {
  if (data.cplList.length > 0 && data.cplList[0].cpmkList.length > 0) {
    modalData.subCpmkTarget = "0_0";
  }
  modal.subCpmk = true;
}

// ── COMPUTED: BADGES ──
const totalCPMK = computed(() =>
  data.cplList.reduce((s, cpl) => s + cpl.cpmkList.length, 0),
);
const totalSubCPMK = computed(() =>
  data.cplList.reduce(
    (s, cpl) =>
      cpl.cpmkList.reduce((ss, cpmk) => ss + cpmk.subCpmkList.length, s),
    0,
  ),
);

// ── COMPUTED: HEADERS ──
const komponenHeaders = computed(() => {
  const headers = [];
  data.cplList.forEach((cpl) =>
    cpl.cpmkList.forEach((cpmk) =>
      cpmk.subCpmkList.forEach((sub) =>
        sub.bobotItems.forEach((b) => {
          const nama = b.label || b.nama;
          if (!headers.includes(nama)) headers.push(nama);
        }),
      ),
    ),
  );
  return headers;
});

const allSubNames = computed(() => {
  const names = [];
  data.cplList.forEach((cpl) =>
    cpl.cpmkList.forEach((cpmk) =>
      cpmk.subCpmkList.forEach((sub) => {
        if (!names.includes(sub.name)) names.push(sub.name);
      }),
    ),
  );
  return names;
});

const allCPMKNames = computed(() => {
  const names = [];
  data.cplList.forEach((cpl) =>
    cpl.cpmkList.forEach((cpmk) => {
      if (!names.includes(cpmk.name)) names.push(cpmk.name);
    }),
  );
  return names;
});

// ── SISA PERSEN ──
const sisaPersen = computed(() => {
  let used = 0;
  data.cplList.forEach((cpl) =>
    cpl.cpmkList.forEach((cpmk) => {
      used += cpmk.persen || 0;
    }),
  );
  return 100 - used;
});

// ── SPAN HELPERS ──
function cplRealSpan(ci) {
  let s = 0;
  data.cplList[ci].cpmkList.forEach((cpmk) =>
    cpmk.subCpmkList.forEach((sub) => {
      s += sub.bobotItems.length;
    }),
  );
  return s;
}

function isCplEmpty(ci) {
  return data.cplList[ci].cpmkList.length === 0;
}

function isCpmkEmpty(ci, mi) {
  const cpmk = data.cplList[ci].cpmkList[mi];
  return (
    cpmk.subCpmkList.length === 0 ||
    cpmk.subCpmkList.every((s) => s.bobotItems.length === 0)
  );
}

function cplTotalSpan(ci) {
  const real = cplRealSpan(ci);
  if (real > 0) return real;
  // CPL has cpmks but no columns yet → 1 placeholder per cpmk (min 1)
  return Math.max(1, data.cplList[ci].cpmkList.length);
}

function cpmkTotalSpan(ci, mi) {
  let s = 0;
  data.cplList[ci].cpmkList[mi].subCpmkList.forEach((sub) => {
    s += sub.bobotItems.length;
  });
  return s > 0 ? s : 1;
}

// ── SUB COLOR HELPERS ──
function globalSubIndex(ci, mi, si) {
  let idx = 0;
  for (let c = 0; c < ci; c++) {
    data.cplList[c].cpmkList.forEach((cpmk) => {
      idx += cpmk.subCpmkList.length;
    });
  }
  for (let m = 0; m < mi; m++) {
    idx += data.cplList[ci].cpmkList[m].subCpmkList.length;
  }
  idx += si;
  return idx;
}

function subColor(ci, mi, si) {
  return SUB_COLORS[globalSubIndex(ci, mi, si) % SUB_COLORS.length];
}

function subBorderStyle(mi, si) {
  if (mi === 0 && si === 0) return "border-left:4px solid #000;";
  if (si === 0) return "border-left:3px solid rgba(0,0,0,0.7);";
  return "border-left:2px solid rgba(0,0,0,0.7);";
}

function colBorderStyle(ci, mi, si, bi) {
  if (mi === 0 && si === 0 && bi === 0) return "border-left:4px solid #000;";
  if (si === 0 && bi === 0) return "border-left:3px solid rgba(0,0,0,0.7);";
  if (bi === 0) return "border-left:2px solid rgba(0,0,0,0.7);";
  return "";
}

// ── NILAI KEY ──
function nilaiKey(ci, mi, si, bi) {
  return `${ci}_${mi}_${si}_${bi}`;
}

// ── RATA-RATA KOLOM ──
function avgKolom(ci, mi, si, bi) {
  const key = nilaiKey(ci, mi, si, bi);
  let sum = 0,
    count = 0;
  data.mahasiswa.forEach((mhs) => {
    const v = parseFloat(mhs.nilai[key]);
    if (!isNaN(v)) {
      sum += v;
      count++;
    }
  });
  return count > 0 ? sum / count : 0;
}

function avgNilai(ci, mi, si, bi) {
  const avg = avgKolom(ci, mi, si, bi);
  return avg > 0 ? avg.toFixed(1) : "—";
}

// ── HITUNG SUB ──
function totalKomponenSub(ci, mi, si) {
  const sub = data.cplList[ci].cpmkList[mi].subCpmkList[si];
  let total = 0;
  sub.bobotItems.forEach((b, bi) => {
    total += (avgKolom(ci, mi, si, bi) / 100) * b.bobot;
  });
  return total;
}

function skalaSub(ci, mi, si) {
  const sub = data.cplList[ci].cpmkList[mi].subCpmkList[si];
  if (!sub.totalBobot) return "0.0";
  return ((totalKomponenSub(ci, mi, si) / sub.totalBobot) * 100).toFixed(1);
}

function nilaiKomponenSub(ci, mi, si, kNama) {
  const sub = data.cplList[ci].cpmkList[mi].subCpmkList[si];
  let val = 0;
  sub.bobotItems.forEach((b, bi) => {
    if ((b.label || b.nama) === kNama) {
      val = (avgKolom(ci, mi, si, bi) / 100) * b.bobot;
    }
  });
  return val > 0 ? val.toFixed(1) : "—";
}

// ── CPMK / CPL CALCS ──
function rataCPMK(ci, mi) {
  const cpmk = data.cplList[ci].cpmkList[mi];
  if (!cpmk.subCpmkList.length) return 0;
  const total = cpmk.subCpmkList.reduce(
    (s, _, si) => s + (parseFloat(skalaSub(ci, mi, si)) || 0),
    0,
  );
  return total / cpmk.subCpmkList.length;
}

function rataCPL(ci) {
  const cpl = data.cplList[ci];
  if (!cpl.cpmkList.length) return 0;
  let total = 0;
  cpl.cpmkList.forEach((_, mi) => {
    total += rataCPMK(ci, mi);
  });
  return total / cpl.cpmkList.length;
}

function nilaiSubDalamCPMK(ci, mi, subHeader) {
  const cpmk = data.cplList[ci].cpmkList[mi];
  const si = cpmk.subCpmkList.findIndex((s) => s.name === subHeader);
  return si !== -1 ? parseFloat(skalaSub(ci, mi, si)).toFixed(2) : "—";
}

function nilaiCPMKDalamCPL(ci, cpmkHeader) {
  const cpl = data.cplList[ci];
  const mi = cpl.cpmkList.findIndex((c) => c.name === cpmkHeader);
  return mi !== -1 ? rataCPMK(ci, mi).toFixed(2) : "—";
}

// ── KATEGORI & STANDAR ──
function getKategoriCPMK(ci, mi) {
  return data.kategoriCPMK?.[`k_${ci}_${mi}`] || "";
}
function setKategoriCPMK(ci, mi, val) {
  if (!data.kategoriCPMK) data.kategoriCPMK = {};
  data.kategoriCPMK[`k_${ci}_${mi}`] = val;
  saveData();
}
function getKategoriCPL(ci) {
  return data.kategoriCPL?.[`kc_${ci}`] || "";
}
function setKategoriCPL(ci, val) {
  if (!data.kategoriCPL) data.kategoriCPL = {};
  data.kategoriCPL[`kc_${ci}`] = val;
  saveData();
}
function getStandarCPL(ci) {
  return data.standarCPL?.[`sc_${ci}`] || "";
}
function setStandarCPL(ci, val) {
  if (!data.standarCPL) data.standarCPL = {};
  data.standarCPL[`sc_${ci}`] = parseFloat(val) || 0;
  saveData();
}
function setStandarSub(ci, mi, si, val) {
  data.cplList[ci].cpmkList[mi].subCpmkList[si].standar = parseFloat(val) || 80;
  saveData();
}

// ── INPUT HANDLERS ──
function setNilai(rowIdx, ci, mi, si, bi, val) {
  if (!data.mahasiswa[rowIdx].nilai) data.mahasiswa[rowIdx].nilai = {};
  data.mahasiswa[rowIdx].nilai[nilaiKey(ci, mi, si, bi)] = val;
  saveData();
}

// ── MANAGE MODE ──
function toggleManageMode() {
  manageMode.value = !manageMode.value;
}

// ── ADD/REMOVE MAHASISWA (jumlah baris bisa diatur, hanya aktif saat Edit Mode) ──
function addMahasiswaRow() {
  const jumlah =
    jumlahBarisInput.value && jumlahBarisInput.value > 0
      ? Math.floor(jumlahBarisInput.value)
      : 1;
  for (let i = 0; i < jumlah; i++) {
    data.mahasiswa.push({ nim: "", nama: "", nilai: {} });
  }
  saveData();
}

function removeLastRow() {
  const jumlah =
    jumlahBarisInput.value && jumlahBarisInput.value > 0
      ? Math.floor(jumlahBarisInput.value)
      : 1;

  if (data.mahasiswa.length <= 1) {
    alert("Minimal 1 baris mahasiswa!");
    return;
  }

  const sisa = data.mahasiswa.length - jumlah;
  if (sisa < 1) {
    alert(
      `Tidak bisa menghapus ${jumlah} baris. Minimal 1 baris mahasiswa harus tersisa (saat ini ${data.mahasiswa.length} baris).`,
    );
    return;
  }

  if (!confirm(`Hapus ${jumlah} baris mahasiswa terakhir?`)) return;
  data.mahasiswa.splice(-jumlah, jumlah);
  saveData();
}

// ── MODAL: ADD CPL ──
function handleAddCPL() {
  const jumlah = modalData.cplJumlah;
  if (!jumlah || jumlah <= 0) {
    alert("Jumlah CPL harus lebih dari 0!");
    return;
  }
  const last = data.cplList.length;
  for (let i = 1; i <= jumlah; i++) {
    data.cplList.push({ name: `CPL ${last + i}`, cpmkList: [] });
  }
  saveData();
  closeModal("cpl");
  modalData.cplJumlah = 1;
}

// ── MODAL: ADD CPMK ──
function generatePersenInputs() {
  const n = modalData.cpmkJumlah || 0;
  modalData.cpmkPersenList = Array(n > 0 ? n : 0).fill(0);
}

function handleAddCPMK() {
  const ci = modalData.cpmkCplIndex;
  const jumlah = modalData.cpmkJumlah;
  if (isNaN(ci) || ci < 0) {
    alert("Pilih CPL!");
    return;
  }
  if (!jumlah || jumlah <= 0) {
    alert("Jumlah CPMK harus lebih dari 0!");
    return;
  }
  const totalBaru = modalData.cpmkPersenList.reduce((s, v) => s + (v || 0), 0);
  const used = data.cplList.reduce(
    (s, cpl) => s + cpl.cpmkList.reduce((ss, c) => ss + (c.persen || 0), 0),
    0,
  );
  if (used + totalBaru > 100) {
    alert(`Total persentase CPMK (${used + totalBaru}%) melebihi 100%!`);
    return;
  }
  let lastNum = 0;
  data.cplList.forEach((cpl) =>
    cpl.cpmkList.forEach((c) => {
      const n = parseInt(c.name.replace("CPMK ", ""));
      if (!isNaN(n) && n > lastNum) lastNum = n;
    }),
  );
  for (let i = 0; i < jumlah; i++) {
    data.cplList[ci].cpmkList.push({
      name: `CPMK ${lastNum + i + 1}`,
      persen: modalData.cpmkPersenList[i] || 0,
      subCpmkList: [],
    });
  }
  saveData();
  closeModal("cpmk");
  modalData.cpmkJumlah = 1;
  modalData.cpmkPersenList = [0];
}

// ── MODAL: ADD SUB-CPMK ──
function generateSubInputs() {
  const n = modalData.subJumlah || 0;
  modalData.subList = Array.from({ length: n > 0 ? n : 0 }, () => ({
    open: true,
    totalBobot: 0,
    komponen: [{ nama: KOMPONEN_LIST[0], bobot: 0 }],
  }));
}

function nomorKomponenDuplikat(sub) {
  const counter = {},
    used = {};
  sub.bobotItems.forEach((item) => {
    counter[item.nama] = (counter[item.nama] || 0) + 1;
  });
  sub.bobotItems.forEach((item) => {
    used[item.nama] = (used[item.nama] || 0) + 1;
    item.label =
      counter[item.nama] > 1 ? `${item.nama} ${used[item.nama]}` : item.nama;
  });
}

function refreshAllLabels() {
  // Counter global (bukan per-CPMK) supaya penomoran komponen berlanjut
  // terus dari CPL 1 -> CPL 2 -> dst, tidak reset tiap ganti CPMK.
  const counter = {};
  data.cplList.forEach((cpl) =>
    cpl.cpmkList.forEach((cpmk) => {
      cpmk.subCpmkList.forEach((sub) => {
        sub.bobotItems.forEach((item) => {
          counter[item.nama] = (counter[item.nama] || 0) + 1;
          item.label = `${item.nama} ${counter[item.nama]}`;
        });
      });
    }),
  );
}

function handleAddSubCPMK() {
  const val = modalData.subCpmkTarget;
  if (!val) {
    alert("Pilih CPMK!");
    return;
  }
  const [ci, mi] = val.split("_").map(Number);
  const persenCPMK = data.cplList[ci].cpmkList[mi].persen || 0;
  let totalSudah = data.cplList[ci].cpmkList[mi].subCpmkList.reduce(
    (s, sub) => s + (sub.totalBobot || 0),
    0,
  );
  let lastNum = 0;
  data.cplList.forEach((cpl) =>
    cpl.cpmkList.forEach((cpmk) =>
      cpmk.subCpmkList.forEach((sub) => {
        const n = parseInt(sub.name.replace("Sub-CPMK ", ""));
        if (!isNaN(n) && n > lastNum) lastNum = n;
      }),
    ),
  );
  for (let i = 0; i < modalData.subList.length; i++) {
    const s = modalData.subList[i];
    const totalBobot = s.totalBobot || 0;
    if (totalSudah + totalBobot > persenCPMK) {
      alert(`Total bobot Sub-CPMK melebihi bobot CPMK (${persenCPMK}%).`);
      return;
    }
    const jumlahKomponen = s.komponen.reduce(
      (sum, k) => sum + (k.bobot || 0),
      0,
    );
    if (jumlahKomponen !== totalBobot) {
      alert(
        `Sub-CPMK ${
          i + 1
        }: Jumlah bobot komponen (${jumlahKomponen}) harus sama dengan Total Bobot (${totalBobot})`,
      );
      return;
    }
    const subData = {
      name: `Sub-CPMK ${lastNum + 1}`,
      totalBobot,
      standar: 80,
      bobotItems: s.komponen.map((k) => ({
        nama: k.nama,
        bobot: k.bobot,
        label: k.nama,
      })),
    };
    nomorKomponenDuplikat(subData);
    data.cplList[ci].cpmkList[mi].subCpmkList.push(subData);
    totalSudah += totalBobot;
    lastNum++;
  }
  refreshAllLabels();
  saveData();
  closeModal("subCpmk");
  modalData.subJumlah = 1;
  modalData.subList = [];
}

// ── MANAGE: EDIT/DELETE ──
function editCPL(ci) {
  const n = prompt("Edit nama CPL:", data.cplList[ci].name);
  if (n?.trim()) {
    data.cplList[ci].name = n.trim();
    saveData();
  }
}
function deleteCPL(ci) {
  if (!confirm("Hapus CPL ini beserta semua CPMK & Sub-CPMK?")) return;
  data.cplList.splice(ci, 1);
  saveData();
}
function editCPMK(ci, mi) {
  const n = prompt("Edit nama CPMK:", data.cplList[ci].cpmkList[mi].name);
  if (n?.trim()) {
    data.cplList[ci].cpmkList[mi].name = n.trim();
    saveData();
  }
}
function deleteCPMK(ci, mi) {
  if (!confirm("Hapus CPMK ini beserta semua Sub-CPMK?")) return;
  data.cplList[ci].cpmkList.splice(mi, 1);
  saveData();
}
function editSubCPMK(ci, mi, si) {
  const sub = data.cplList[ci].cpmkList[mi].subCpmkList[si];
  const t = parseInt(prompt("Edit Total Bobot:", sub.totalBobot));
  if (isNaN(t)) return;
  const persenCPMK = data.cplList[ci].cpmkList[mi].persen || 0;
  const totalLain = data.cplList[ci].cpmkList[mi].subCpmkList.reduce(
    (s, sv, idx) => (idx !== si ? s + (sv.totalBobot || 0) : s),
    0,
  );
  if (totalLain + t > persenCPMK) {
    alert(`Total bobot tidak boleh melebihi ${persenCPMK}%`);
    return;
  }
  sub.totalBobot = t;
  saveData();
}
function deleteSubCPMK(ci, mi, si) {
  if (!confirm("Hapus Sub-CPMK ini?")) return;
  data.cplList[ci].cpmkList[mi].subCpmkList.splice(si, 1);
  saveData();
}
function editKomponen(ci, mi, si, bi) {
  const item = data.cplList[ci].cpmkList[mi].subCpmkList[si].bobotItems[bi];
  const n = prompt("Nama Komponen:", item.nama);
  if (n !== null) item.nama = n;
  const b = prompt("Bobot Komponen:", item.bobot);
  if (b !== null) item.bobot = parseInt(b) || 0;
  refreshAllLabels();
  saveData();
}
function deleteKomponen(ci, mi, si, bi) {
  if (!confirm("Hapus komponen ini?")) return;
  data.cplList[ci].cpmkList[mi].subCpmkList[si].bobotItems.splice(bi, 1);
  refreshAllLabels();
  saveData();
}

// ── ISI SEMUA KOLOM ──
function isiSemuaKolom(ci, mi, si, bi) {
  const nilai = prompt("Masukkan nilai untuk semua mahasiswa:");
  if (nilai === null) return;
  const angka = parseFloat(nilai);
  if (isNaN(angka) || angka < 0 || angka > 100) {
    alert("Nilai harus 0 - 100");
    return;
  }
  const key = nilaiKey(ci, mi, si, bi);
  data.mahasiswa.forEach((mhs) => {
    mhs.nilai[key] = angka;
  });
  saveData();
}

// ── CHARTS ──
const subCpmkChartRef = ref(null);
const cpmkChartRef = ref(null);
const cplChartRef = ref(null);
const cplStandarChartRef = ref(null);

let subChart = null,
  cpmkChart = null,
  cplChart = null,
  cplStandarChart = null;

function renderSubCPMKChart() {
  const labels = [],
    hasil = [],
    standar = [];
  data.cplList.forEach((cpl, ci) =>
    cpl.cpmkList.forEach((cpmk, mi) =>
      cpmk.subCpmkList.forEach((sub, si) => {
        labels.push(sub.name);
        hasil.push(parseFloat(skalaSub(ci, mi, si)) || 0);
        standar.push(sub.standar || 80);
      }),
    ),
  );
  const ctx = subCpmkChartRef.value;
  if (!ctx) return;
  if (subChart) subChart.destroy();
  subChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Hasil Pengukuran",
          data: hasil,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.2)",
          borderWidth: 3,
        },
        {
          label: "Standar Pencapaian",
          data: standar,
          borderColor: "#ea580c",
          backgroundColor: "rgba(234,88,12,0.15)",
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Hasil Pengukuran vs Sub-CPMK",
          font: { size: 18 },
        },
      },
    },
  });
}

function renderCPMKChart() {
  const labels = [];
  const semuaSub = allSubNames.value;
  const datasets = semuaSub.map((subName, i) => ({
    label: subName,
    data: [],
    backgroundColor: SUB_COLORS[i % SUB_COLORS.length].accent,
  }));
  data.cplList.forEach((cpl, ci) =>
    cpl.cpmkList.forEach((cpmk, mi) => {
      labels.push(cpmk.name);
      semuaSub.forEach((subHeader, subIndex) => {
        const si = cpmk.subCpmkList.findIndex((s) => s.name === subHeader);
        datasets[subIndex].data.push(
          si !== -1 ? parseFloat(skalaSub(ci, mi, si)) || 0 : 0,
        );
      });
    }),
  );
  const ctx = cpmkChartRef.value;
  if (!ctx) return;
  if (cpmkChart) cpmkChart.destroy();
  cpmkChart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "HASIL PENGUKURAN CPMK BERDASARKAN NILAI SUB-CPMK",
        },
        legend: { position: "bottom" },
      },
      scales: { y: { beginAtZero: true, max: 100 } },
    },
  });
}

function renderCPLChart() {
  const labels = [];
  const semuaCPMK = allCPMKNames.value;
  const datasets = semuaCPMK.map((cpmkName, i) => ({
    label: cpmkName,
    data: [],
    backgroundColor: CPL_COLORS[i % CPL_COLORS.length],
  }));
  data.cplList.forEach((cpl, ci) => {
    labels.push(cpl.name);
    semuaCPMK.forEach((cpmkName, cpmkIndex) => {
      const mi = cpl.cpmkList.findIndex((c) => c.name === cpmkName);
      datasets[cpmkIndex].data.push(
        mi !== -1 ? Number(rataCPMK(ci, mi).toFixed(2)) : 0,
      );
    });
  });
  const ctx = cplChartRef.value;
  if (!ctx) return;
  if (cplChart) cplChart.destroy();
  cplChart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "HASIL UKUR CPL BERDASARKAN NILAI CPMK" },
        legend: { position: "bottom" },
      },
      scales: { y: { beginAtZero: true, max: 100 } },
    },
  });
}

function renderCPLStandarChart() {
  const labels = [],
    nilaiArr = [],
    standarArr = [];
  data.cplList.forEach((_, ci) => {
    labels.push(data.cplList[ci].name);
    nilaiArr.push(Number(rataCPL(ci).toFixed(2)));
    standarArr.push(parseFloat(data.standarCPL?.[`sc_${ci}`]) || 0);
  });
  const ctx = cplStandarChartRef.value;
  if (!ctx) return;
  if (cplStandarChart) cplStandarChart.destroy();
  cplStandarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Nilai Rata-rata",
          data: nilaiArr,
          backgroundColor: "#2563eb",
        },
        {
          label: "Standar Pencapaian",
          data: standarArr,
          backgroundColor: "#ea580c",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "HASIL UKUR CPL VS STANDAR PENCAPAIAN" },
        legend: { position: "bottom" },
      },
      scales: { y: { beginAtZero: true, max: 100 } },
    },
  });
}

function renderAllCharts() {
  nextTick(() => {
    renderSubCPMKChart();
    renderCPMKChart();
    renderCPLChart();
    renderCPLStandarChart();
  });
}

// Watch: keep komponen labels in sync, then re-render charts whenever data changes
watch(
  () => JSON.stringify({ cplList: data.cplList, mahasiswa: data.mahasiswa }),
  () => {
    refreshAllLabels();
    renderAllCharts();
  },
  { deep: true },
);

onMounted(async () => {
  // Coba load dari API dulu
  try {
    const [strukturRes, nilaiRes] = await Promise.all([
      api.get(`/penilaian/${mkId}/struktur`),
      api.get(`/penilaian/${mkId}/nilai`),
    ]);

    if (strukturRes.data.struktur) {
      const s = strukturRes.data.struktur;
      data.cplList = s.cplList || [];
      data.kategoriCPMK = s.kategoriCPMK || {};
      data.kategoriCPL = s.kategoriCPL || {};
      data.standarCPL = s.standarCPL || {};
    }

    if (nilaiRes.data.length > 0) {
      data.mahasiswa = nilaiRes.data;
    }
  } catch (e) {
    // Fallback ke localStorage jika API gagal
    console.log("Load dari localStorage:", e.message);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      data.cplList = parsed.cplList || [];
      data.mahasiswa = parsed.mahasiswa || [{ nim: "", nama: "", nilai: {} }];
      data.kategoriCPMK = parsed.kategoriCPMK || {};
      data.kategoriCPL = parsed.kategoriCPL || {};
      data.standarCPL = parsed.standarCPL || {};
    }
  }

  refreshAllLabels();
  renderAllCharts();
});
</script>

<style scoped>
/* ── TOOLBAR ── */
.admin-toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  font-family: "Inter", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary {
  background: #9b1530;
  color: #fff;
}
.btn-primary:hover {
  background: #7b1020;
}
.btn-secondary {
  background: #fff;
  color: #4b5563;
  border: 1px solid #e5e7eb !important;
}
.btn-secondary:hover {
  background: #f3f4f6;
}
.btn-orange {
  background: #f97316;
  color: #fff;
}
.btn-orange:hover {
  background: #ea580c;
}
.btn-green {
  background: #16a34a;
  color: #fff;
}
.btn-green:hover {
  background: #15803d;
}
.btn-dark {
  background: #0f172a;
  color: #fff;
}
.btn-dark:hover {
  background: #1e293b;
}
.btn-sm {
  padding: 7px 12px;
  font-size: 0.76rem;
}
.icon-plus {
  font-size: 1.1rem;
  line-height: 1;
}
.icon-minus {
  font-size: 1.1rem;
  line-height: 1;
}

/* ── PAGE HEADER ── */
.page-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}
.back-btn:hover {
  background: #f3f4f6;
}
.back-btn svg {
  width: 16px;
  height: 16px;
}
.page-title-wrap h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1d2e;
}
.subtitle {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 2px;
}
.hasil-cpl-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  padding: 10px 18px;
  font-size: 0.83rem;
  border-radius: 10px;
  flex-shrink: 0;
}

/* ── WRAPPER ── */
.wrapper {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  min-height: 200px;
}
.table-header {
  padding: 20px 24px 14px;
  border-bottom: 1px solid #e2e6ef;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.table-header h2 {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1d2e;
}
.badge {
  font-size: 0.68rem;
  font-weight: 600;
  background: #e8eaf6;
  color: #5c6bc0;
  border-radius: 6px;
  padding: 2px 8px;
  text-transform: uppercase;
}
.table-scroll {
  overflow-x: auto;
}

/* ── ROW CONTROLS (Tambah/Hapus Baris — hanya tampil saat Edit Mode) ── */
.row-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-wrap: wrap;
}
.row-controls-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  white-space: nowrap;
}
.row-count-input {
  width: 64px;
  padding: 7px 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-family: "DM Mono", monospace;
  font-size: 0.85rem;
  text-align: center;
  color: #1a1d2e;
  background: #f9fafb;
  transition: all 0.2s;
}
.row-count-input:focus {
  outline: none;
  border-color: #9b1530;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(155, 21, 48, 0.08);
}

/* ── TABLE ── */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.meta-row td {
  background: #f7f8fc;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  padding: 9px 14px;
  border-bottom: 1px solid #e2e6ef;
  text-transform: uppercase;
}
.meta-row td.label-cell {
  text-align: left;
  color: #9ca3af;
  font-weight: 500;
}

.subcpmk-row td {
  padding: 10px 14px;
  text-align: center;
  font-weight: 700;
  font-size: 0.8rem;
  border-bottom: 1px solid #e2e6ef;
}
.row-label {
  background: #f7f8fc;
  text-align: left !important;
  color: #9ca3af;
  font-weight: 500;
  padding: 10px 14px;
}

.bobot-row td {
  background: #f7f8fc;
  text-align: center;
  font-weight: 600;
  font-size: 0.78rem;
  padding: 8px 14px;
  border-bottom: 1px solid #e2e6ef;
  color: #6b7280;
}
.big-bobot {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1d2e;
}

.col-header th {
  background: #1a1d2e;
  color: #fff;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 12px 14px;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
}
.col-header th.left {
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #e2e6ef;
  transition: background 0.15s;
}
tbody tr:last-child {
  border-bottom: none;
}
tbody tr:hover {
  background: #f5f7ff;
}
tbody td {
  padding: 13px 14px;
  text-align: center;
  color: #1a1d2e;
  font-size: 0.875rem;
  height: 48px;
}
tbody td.no {
  color: #9ca3af;
  font-family: "DM Mono", monospace;
  font-size: 0.78rem;
}
tbody td.nim {
  font-family: "DM Mono", monospace;
  font-size: 0.82rem;
  color: #5c6bc0;
  font-weight: 500;
  min-width: 140px;
}
tbody td.nama {
  text-align: left;
  font-weight: 500;
  min-width: 220px;
}

tbody td input {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  text-align: center;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  padding: 6px 4px;
  border-radius: 6px;
  transition: all 0.2s;
  color: #1a1d2e;
}
tbody td input:hover {
  border-color: #e5e7eb;
  background: #f9fafb;
}
tbody td input:focus {
  outline: none;
  border-color: #9b1530;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(155, 21, 48, 0.12);
}
tbody td input.nama-input {
  text-align: left;
}

.avg-row td {
  background: #eef2ff;
  font-weight: 700;
  color: #4338ca;
  border-top: 2px solid #c7d2fe;
}
.avg-row td.label {
  text-align: left;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-cell {
  background: #f7f8fc;
  color: #9ca3af;
  text-align: center;
  font-style: italic;
  font-size: 0.75rem;
}

/* ── MANAGE BUTTONS ── */
.edit-btn, .delete-btn, .fill-column-btn {
  border: none; cursor: pointer;
  width: 24px; height: 24px;
  border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  margin-left: 3px; vertical-align: middle;
  transition: all 0.18s;
  flex-shrink: 0;
}
.edit-btn { background: #ede9fe; color: #7c3aed; }
.edit-btn:hover { background: #ddd6fe; transform: scale(1.12); }
.edit-btn svg { width: 11px; height: 11px; }
.delete-btn { background: #fee2e2; color: #dc2626; }
.delete-btn:hover { background: #fecaca; transform: scale(1.12); }
.delete-btn svg { width: 11px; height: 11px; }
.fill-column-btn { background: #cffafe; color: #0891b2; }
.fill-column-btn:hover { background: #a5f3fc; transform: scale(1.12); }
.fill-column-btn svg { width: 11px; height: 11px; }

/* ── ANALYSIS TABLES ── */
.analysis-card {
  background: #fff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  border: 1px solid #ececec;
}
.analysis-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1d2e;
  margin-bottom: 16px;
}
.modern-table-wrap {
  overflow-x: auto;
}
.modern-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}
.modern-table thead th {
  background: linear-gradient(135deg, #7b1020, #1a1d2e);
  color: white;
  font-size: 0.83rem;
  font-weight: 600;
  padding: 14px;
  text-align: center;
}
.modern-table thead th:first-child {
  border-top-left-radius: 12px;
}
.modern-table thead th:last-child {
  border-top-right-radius: 12px;
}
.modern-table tbody td {
  padding: 13px;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 0.84rem;
  color: #374151;
}
.modern-table tbody tr:hover {
  background: #faf7f8;
}
.modern-table tbody td:first-child {
  font-weight: 600;
  background: #fafafa;
}

/* ── CHARTS ── */
.chart-box {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
.chart-container {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* ── STANDAR/KATEGORI INPUTS (inside analysis tables) ── */
.standar-input {
  width: 80px;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 0.82rem;
  font-family: "Inter", sans-serif;
}
.standar-input:focus {
  outline: none;
  border-color: #9b1530;
}
.kategori-input {
  width: 130px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.82rem;
  font-family: "Inter", sans-serif;
}
.kategori-input:focus {
  outline: none;
  border-color: #9b1530;
}

/* ── MODALS ── */
.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 200;
  align-items: center;
  justify-content: center;
}
.modal-overlay.show {
  display: flex;
}
.modal {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: modalIn 0.25s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}
@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
}
.modal h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1d2e;
  margin-bottom: 20px;
}
.modal label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
}
.modal input,
.modal select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  color: #1f2937;
  background: #f9fafb;
  outline: none;
  margin-bottom: 16px;
  transition: all 0.2s;
}
.modal input:focus,
.modal select:focus {
  border-color: #9b1530;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(155, 21, 48, 0.08);
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 6px;
}
.modal-actions .btn {
  padding: 10px 20px;
}

.input-prefix-group {
  display: flex;
  align-items: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  overflow: hidden;
  margin-bottom: 16px;
  transition: all 0.2s;
}
.input-prefix-group:focus-within {
  border-color: #9b1530;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(155, 21, 48, 0.08);
}
.input-prefix {
  padding: 10px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #9b1530;
  background: #f3e8eb;
  white-space: nowrap;
  border-right: 1.5px solid #e5e7eb;
  user-select: none;
}
.input-prefix-group input {
  border: none !important;
  background: transparent !important;
  margin-bottom: 0 !important;
  box-shadow: none !important;
  flex: 1;
  padding: 10px 14px;
  font-family: "DM Mono", monospace;
  font-size: 0.9rem;
  font-weight: 600;
}
.input-prefix-group input:focus {
  outline: none;
  box-shadow: none !important;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}
.info-badge.warn {
  background: #fef3c7;
  color: #92400e;
}
.info-badge.ok {
  background: #dcfce7;
  color: #166534;
}

/* Sub-CPMK modal boxes */
.sub-box {
  border: 1px solid #ddd;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 15px;
}
.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 18px;
  cursor: pointer;
  background: #fff;
  font-weight: 700;
  color: #9b1530;
}
.sub-content {
  display: none;
  padding: 20px;
  border-top: 1px solid #eee;
}
.sub-box.open .sub-content {
  display: block;
}
.arrow {
  transition: transform 0.3s;
  display: inline-block;
}
.sub-box.open .arrow {
  transform: rotate(90deg);
}
.komponen-item {
  display: grid;
  grid-template-columns: 1fr 100px 40px;
  gap: 10px;
  margin-top: 10px;
  align-items: center;
}
.komponen-item select,
.komponen-item input {
  margin-bottom: 0;
}
.btn-add-komponen {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 14px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
}
.remove-komponen {
  border: none;
  background: #dc2626;
  color: #fff;
  border-radius: 8px;
  height: 38px;
  cursor: pointer;
  font-size: 1rem;
}
</style>