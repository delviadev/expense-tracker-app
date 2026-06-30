/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = [] [DONE]
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date() [DONE]

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM [DONE]

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang [DONE]
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement() [DONE]
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList [DONE]
 */

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya [DONE]
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array [DONE]

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong [DONE]
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1 [DONE]
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran) [DONE]
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML [DONE]
 */

/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse(). [DONE]
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage. [DONE]
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan. [DONE]
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai. [DONE]
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income' [DONE]
 *  - Simpan perubahan ke localStorage dan perbarui tampilan [DONE]
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi [DONE]
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut [DONE]
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */

const transactionFormTitleInput = document.getElementById(
  "transactionFormTitleInput",
);
const transactionFormAmountInput = document.getElementById(
  "transactionFormAmountInput",
);
const transactionFormDateInput = document.getElementById(
  "transactionFormDateInput",
);
const transactionFormTypeSelect = document.getElementById(
  "transactionFormTypeSelect",
);
const incomelist = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");
const searchTransactionForm = document.getElementById("searchTransactionForm");
const searchTransactionFormTitleInput = document.getElementById(
  "searchTransactionFormTitleInput",
);

const trackerSummaryBalanceAmount = document.querySelector(
  ".tracker-summary__balance-amount",
);
const trackerSummaryIncomeAmount = document.querySelector(
  ".tracker-summary__stat-amount--income",
);
const trackerSummaryExpenseAmount = document.querySelector(
  ".tracker-summary__stat-amount--expense",
);

const transactionForm = document.getElementById("transactionForm");
const STORAGE_KEY = "STORAGE_KEY";
const TRANSACTION_UPDATED_EVENT = "transaction:updated";
const SAVED_EVENT = "SAVED_EVENT";

let transactions = [];
let currentlyEditingId = null;

(function injectButtonStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .tracker-transaction-item__btn--icon {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      border: 1px solid var(--border-light);
      background: var(--bg-page);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      padding: 0;
      flex-shrink: 0;
      font-family: inherit;
    }
    .tracker-transaction-item__btn--icon svg {
      pointer-events: none;
    }
    .tracker-transaction-item__btn--edit:hover {
      background: #EFF6FF;
      border-color: #BFDBFE;
    }
    .tracker-transaction-item__btn--edit:hover svg {
      stroke: #2563EB;
    }
    .tracker-transaction-item__btn--danger:hover {
      background: #FFF1F2;
      border-color: #FDA4AF;
    }
    .tracker-transaction-item__btn--danger:hover svg {
      stroke: #F43F5E;
    }
    .tracker-transaction-item__btn--swap {
      height: 28px;
      padding: 0 0.55rem;
      border-radius: 9px;
      border: 1px solid var(--border-light);
      background: var(--bg-page);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
      font-family: inherit;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .tracker-transaction-item__btn--swap:hover {
      background: #E4E4E7;
      color: var(--text-dark);
      border-color: #D4D4D8;
    }
    .tracker-transaction-item__btn--swap svg {
      pointer-events: none;
      flex-shrink: 0;
    }
    .tracker-transaction-item__actions {
      display: flex;
      gap: 0.3rem;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  `;
  document.head.appendChild(style);
})();

(function preventColumnStretch() {
  if (incomelist.parentElement) {
    incomelist.parentElement.style.alignSelf = "start";
  }
  if (expenseList.parentElement) {
    expenseList.parentElement.style.alignSelf = "start";
  }
})();

function checkStorage() {
  return typeof Storage !== "undefined";
}

function generateId() {
  return +new Date();
}

function createTransactionObject(title, amount, date, type) {
  return {
    id: generateId(),
    title: title,
    amount: amount,
    date: date,
    type: type,
  };
}

function validateInput(title, amount, date, type) {
  if (title.trim() === "") {
    alert("Keterangan tidak boleh kosong!");
    return false;
  } else if (amount < 1) {
    alert("Nominal harus lebih besar dari 0 rupiah!");
    return false;
  } else if (!date) {
    alert("Tanggal tidak boleh kosong!");
    return false;
  } else if (!type) {
    alert("Klasifikasi (Pemasukan/Pengeluaran) harus dipilih!");
    return false;
  }
  return true;
}

transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (checkStorage()) {
    const amountValue = Number(transactionFormAmountInput.value);

    if (
      validateInput(
        transactionFormTitleInput.value,
        amountValue,
        transactionFormDateInput.value,
        transactionFormTypeSelect.value,
      )
    ) {
      if (currentlyEditingId !== null) {
        const index = findTransactionIndex(currentlyEditingId);

        postEditedTransaction(
          (transactions[index] = {
            id: currentlyEditingId,
            title: transactionFormTitleInput.value,
            amount: amountValue,
            date: transactionFormDateInput.value,
            type: transactionFormTypeSelect.value,
          }),
        );
      } else {
        const newTrasaction = createTransactionObject(
          transactionFormTitleInput.value,
          amountValue,
          transactionFormDateInput.value,
          transactionFormTypeSelect.value,
        );

        postTransactionList(newTrasaction);
      }
      transactionForm.reset();
    } else {
      return;
    }
  }
});

function postTransactionList(data) {
  if (checkStorage()) {
    transactions.unshift(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

    document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (checkStorage()) {
    loadDataFromStorage();
    countSummary();
  }
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const transaction of data) {
      transactions.push(transaction);
    }
  }

  document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
}

function renderTransactions(data = transactions) {
  incomelist.innerHTML = "";
  expenseList.innerHTML = "";

  const incomes = data.filter((t) => t.type === "income");
  const expenses = data.filter((t) => t.type === "expense");

  if (incomes.length === 0) {
    incomelist.append(createEmptyState("income"));
  } else {
    for (const transaction of incomes) {
      incomelist.append(makeTransaction(transaction));
    }
  }

  if (expenses.length === 0) {
    expenseList.append(createEmptyState("expense"));
  } else {
    for (const transaction of expenses) {
      expenseList.append(makeTransaction(transaction));
    }
  }
}

document.addEventListener(TRANSACTION_UPDATED_EVENT, function () {
  const keyword = searchTransactionFormTitleInput.value;

  if (keyword.trim() === "") {
    renderTransactions();
  } else {
    searchTransactions(keyword);
  }

  countSummary();
});

function makeTransaction(transaction) {
  const { id, title, amount, date, type } = transaction;
  const isIncome = type === "income";

  const formattedAmount = Number(amount).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const icon = document.createElement("div");
  icon.classList.add(
    "tracker-transaction-item__icon",
    `tracker-transaction-item__icon--${type}`,
  );
  icon.innerText = isIncome ? "+" : "-";

  const textTitle = document.createElement("h4");
  textTitle.classList.add("tracker-transaction-item__title");
  textTitle.setAttribute("data-testid", "transactionItemTitle");
  textTitle.innerText = title;

  const textDate = document.createElement("p");
  textDate.classList.add("tracker-transaction-item__date");
  textDate.setAttribute("data-testid", "transactionItemDate");
  textDate.title = formattedDate;
  textDate.innerText = `Tanggal: ${date}`;

  const textType = document.createElement("p");
  textType.classList.add("tracker-transaction-item__type");
  textType.setAttribute("data-testid", "transactionItemType");
  textType.style.cssText = `
    font-size: 0.78rem;
    color: var(--text-muted);
    margin: 0.15rem 0 0 0;
  `;
  textType.innerText = `Tipe: ${isIncome ? "Pemasukan" : "Pengeluaran"}`;

  const detail = document.createElement("div");
  detail.classList.add("tracker-transaction-item__detail");
  detail.append(textTitle, textDate, textType);

  const textAmount = document.createElement("p");
  textAmount.classList.add(
    "tracker-transaction-item__amount",
    `tracker-transaction-item__amount--${type}`,
  );
  textAmount.setAttribute("data-testid", "transactionItemAmount");
  textAmount.innerText = `Nominal: ${formattedAmount}`;

  const right = document.createElement("div");
  right.classList.add("tracker-transaction-item__right");

  const container = document.createElement("article");
  container.classList.add("tracker-transaction-item");
  container.setAttribute("data-transaction-id", id);
  container.setAttribute("data-testid", "transactionItem");
  container.append(icon, detail, right);

  const editButton = document.createElement("button");
  editButton.classList.add(
    "tracker-transaction-item__btn",
    "tracker-transaction-item__btn--icon",
    "tracker-transaction-item__btn--edit",
  );
  editButton.title = "Edit transaksi";
  editButton.setAttribute("aria-label", "Edit transaksi");
  editButton.setAttribute("data-testid", "transactionItemEditButton");
  editButton.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  editButton.addEventListener("click", function () {
    editTransaction(id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "tracker-transaction-item__btn",
    "tracker-transaction-item__btn--icon",
    "tracker-transaction-item__btn--danger",
  );
  deleteButton.title = "Hapus transaksi";
  deleteButton.setAttribute("aria-label", "Hapus transaksi");
  deleteButton.setAttribute("data-testid", "transactionItemDeleteButton");
  deleteButton.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;
  deleteButton.addEventListener("click", function () {
    removeTransaction(id);
  });

  const switchTypeButton = document.createElement("button");
  switchTypeButton.classList.add(
    "tracker-transaction-item__btn",
    "tracker-transaction-item__btn--swap",
  );
  switchTypeButton.title = isIncome
    ? "Ubah ke pengeluaran"
    : "Ubah ke pemasukan";
  switchTypeButton.setAttribute("data-testid", "transactionItemEditTypeButton");
  switchTypeButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>Ubah tipe`;
  switchTypeButton.addEventListener("click", function () {
    switchTransactionType(id);
  });

  const actions = document.createElement("div");
  actions.classList.add("tracker-transaction-item__actions");
  actions.append(editButton, deleteButton, switchTypeButton);

  right.append(textAmount, actions);

  return container;
}

function editTransaction(transactionId) {
  const transactionIndex = findTransactionIndex(transactionId);

  if (transactionIndex === -1) return;
  const transaction = transactions[transactionIndex];

  transactionFormTitleInput.value = transaction.title;
  transactionFormAmountInput.value = transaction.amount;
  transactionFormDateInput.value = transaction.date;
  transactionFormTypeSelect.value = transaction.type;

  currentlyEditingId = transactionId;
}

function removeTransaction(transactionId) {
  const transactionIndex = findTransactionIndex(transactionId);

  if (transactionIndex === -1) return;

  transactions.splice(transactionIndex, 1);
  document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
  saveData();
}

function saveData() {
  if (checkStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function switchTransactionType(transactionId) {
  const transactionIndex = findTransactionIndex(transactionId);

  if (transactionIndex === -1) return;

  transactions[transactionIndex].type =
    transactions[transactionIndex].type === "income" ? "expense" : "income";

  document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
  saveData();
}

function postEditedTransaction(data) {
  const index = findTransactionIndex(data.id);

  if (index !== -1) {
    transactions[index] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
  }

  currentlyEditingId = null;
}

function findTransactionIndex(transactionId) {
  for (const index in transactions) {
    if (transactions[index].id === transactionId) {
      return index;
    }
  }
  return -1;
}

function searchTransactions(keyword) {
  if (keyword.trim() === "") {
    renderTransactions();
    return;
  }

  const filtered = transactions.filter((transaction) =>
    transaction.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  if (filtered.length === 0) {
    incomelist.innerHTML = "";
    expenseList.innerHTML = "";

    incomelist.append(createSearchEmptyState(keyword));
    expenseList.append(createSearchEmptyState(keyword));

    return;
  }

  renderTransactions(filtered);
}

searchTransactionFormTitleInput.addEventListener("input", function () {
  const keyword = searchTransactionFormTitleInput.value;
  searchTransactions(keyword);
});

searchTransactionForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const keyword = searchTransactionFormTitleInput.value;
  searchTransactions(keyword);
});

function countSummary() {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      totalIncome += Number(transaction.amount);
    } else {
      totalExpense += Number(transaction.amount);
    }
  }

  const balance = totalIncome - totalExpense;

  trackerSummaryBalanceAmount.innerText = balance.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  trackerSummaryIncomeAmount.innerText = totalIncome.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  trackerSummaryExpenseAmount.innerText = totalExpense.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}

function createEmptyState(type) {
  const isIncome = type === "income";

  const iconSvg = isIncome
    ? `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`
    : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`;

  const iconEl = document.createElement("div");
  iconEl.style.cssText = `
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${isIncome ? "var(--bg-income)" : "var(--bg-expense)"};
    flex-shrink: 0;
  `;
  iconEl.innerHTML = iconSvg;

  const titleEl = document.createElement("p");
  titleEl.style.cssText = `
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
  `;
  titleEl.innerText = isIncome
    ? "Belum ada pemasukan"
    : "Belum ada pengeluaran";

  const subtitleEl = document.createElement("p");
  subtitleEl.style.cssText = `
    font-size: 0.78rem;
    color: var(--text-muted);
    margin: 0;
    max-width: 160px;
    line-height: 1.5;
  `;
  subtitleEl.innerText = isIncome
    ? "Tambahkan pemasukan pertamamu lewat form di atas."
    : "Catat pengeluaranmu menggunakan form di atas.";

  const wrapper = document.createElement("div");
  wrapper.classList.add("empty-state");
  wrapper.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    text-align: center;
    padding: 2rem 1rem;
    min-height: 180px;
  `;
  wrapper.append(iconEl, titleEl, subtitleEl);

  return wrapper;
}

function createSearchEmptyState(keyword) {
  const iconEl = document.createElement("div");
  iconEl.style.cssText = `
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-page);
    border: 1px solid var(--border-light);
    flex-shrink: 0;
  `;
  iconEl.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6M11 8v6" stroke-dasharray="2 2"/></svg>`;

  const titleEl = document.createElement("p");
  titleEl.style.cssText = `
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
  `;
  titleEl.innerText = "Tidak ada hasil";

  const subtitleEl = document.createElement("p");
  subtitleEl.style.cssText = `
    font-size: 0.78rem;
    color: var(--text-muted);
    margin: 0;
    max-width: 180px;
    line-height: 1.5;
  `;
  subtitleEl.innerText = `Transaksi dengan judul "${keyword}" tidak ditemukan.`;

  const wrapper = document.createElement("div");
  wrapper.classList.add("search-empty");
  wrapper.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    text-align: center;
    padding: 2rem 1rem;
    min-height: 180px;
  `;
  wrapper.append(iconEl, titleEl, subtitleEl);

  return wrapper;
}
