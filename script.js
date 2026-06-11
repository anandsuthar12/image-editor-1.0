const filters = [
  { name: "brightness", value: 100, min: 0, max: 200, unit: "%" },
  { name: "contrast", value: 100, min: 0, max: 200, unit: "%" },
  { name: "saturate", value: 100, min: 0, max: 200, unit: "%" },
  { name: "hue-rotate", value: 0, min: 0, max: 360, unit: "deg" },
  { name: "grayscale", value: 0, min: 0, max: 100, unit: "%" },
  { name: "sepia", value: 0, min: 0, max: 100, unit: "%" },
  { name: "invert", value: 0, min: 0, max: 100, unit: "%" },
  { name: "blur", value: 0, min: 0, max: 20, unit: "px" },
  { name: "opacity", value: 100, min: 0, max: 100, unit: "%" },
];

let dupli = structuredClone(filters);

const presets = [
  {
    name: "Original",
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    opacity: 100,
  },
  {
    name: "Vintage",
    brightness: 110,
    contrast: 120,
    saturate: 80,
    hueRotate: 0,
    grayscale: 0,
    sepia: 70,
    invert: 0,
    blur: 0,
    opacity: 100,
  },
  {
    name: "Black & White",
    brightness: 100,
    contrast: 120,
    saturate: 0,
    hueRotate: 0,
    grayscale: 100,
    sepia: 0,
    invert: 0,
    blur: 0,
    opacity: 100,
  },
  {
    name: "Warm",
    brightness: 110,
    contrast: 105,
    saturate: 130,
    hueRotate: 15,
    grayscale: 0,
    sepia: 20,
    invert: 0,
    blur: 0,
    opacity: 100,
  },
  {
    name: "Cool",
    brightness: 100,
    contrast: 110,
    saturate: 120,
    hueRotate: 180,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    opacity: 100,
  },
  {
    name: "Vivid",
    brightness: 115,
    contrast: 130,
    saturate: 180,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    opacity: 100,
  },
  {
    name: "Dreamy",
    brightness: 120,
    contrast: 90,
    saturate: 120,
    hueRotate: 20,
    grayscale: 0,
    sepia: 15,
    invert: 0,
    blur: 2,
    opacity: 100,
  },
  {
    name: "Dark",
    brightness: 70,
    contrast: 140,
    saturate: 90,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    opacity: 100,
  },
  {
    name: "Retro",
    brightness: 105,
    contrast: 115,
    saturate: 90,
    hueRotate: 10,
    grayscale: 10,
    sepia: 50,
    invert: 0,
    blur: 0,
    opacity: 100,
  },
  {
    name: "Negative",
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 100,
    blur: 0,
    opacity: 100,
  },
];

const filterBox = document.querySelector(".filters");
const presetBox = document.querySelector(".preset");
const overlay = document.querySelector(".imgoverlay");

const resetBtn = document.querySelector("#reset-btn");
const downloadBtn = document.querySelector("#download-btn");
const imgInput = document.querySelector("#chooseImg");

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let allInputs;
let originalImg = null;

function getFilterString() {
  return dupli
    .map(filter => `${filter.name}(${filter.value}${filter.unit})`)
    .join(" ");
}

function setupFilters() {
  let html = "";

  dupli.forEach((filter, idx) => {
    html += `
      <div class="filter">
        <p>${filter.name}</p>
        <input
          type="range"
          class="filter-prop"
          data-which="${idx}"
          min="${filter.min}"
          max="${filter.max}"
          value="${filter.value}"
        >
      </div>
    `;
  });

  filterBox.innerHTML = html;
  allInputs = document.querySelectorAll(".filter-prop");
}

function setupPresets() {
  let html = "";

  presets.forEach((preset, idx) => {
    html += `<button id="${idx}">${preset.name}</button>`;
  });

  presetBox.innerHTML = html;
}

function updateCanvasFilter() {
  canvas.style.filter = getFilterString();
}

function resetInputs() {
  filters.forEach((filter, idx) => {
    dupli[idx].value = filter.value;
  });

  setupFilters();
  updateCanvasFilter();
}

setupFilters();
setupPresets();

imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];

  if (!file) return;

  overlay.style.display = "none";

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    originalImg = img;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    URL.revokeObjectURL(img.src);
  };
});

filterBox.addEventListener("input", (e) => {
  if (!e.target.classList.contains("filter-prop")) return;

  const idx = e.target.dataset.which;

  dupli[idx].value = Number(e.target.value);

  updateCanvasFilter();
});

presetBox.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const selectedPreset = presets[e.target.id];

  let idx = 0;

  for (let key in selectedPreset) {
    if (key !== "name") {
      dupli[idx].value = selectedPreset[key];
      idx++;
    }
  }

  setupFilters();
  updateCanvasFilter();
});

resetBtn.addEventListener("click", () => {
  dupli = structuredClone(filters);

  setupFilters();

  canvas.style.filter = "none";
});

downloadBtn.addEventListener("click", () => {
  if (!originalImg) {
    alert("Please upload an image first.");
    return;
  }

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = originalImg.width;
  tempCanvas.height = originalImg.height;

  tempCtx.filter = getFilterString();

  tempCtx.drawImage(
    originalImg,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height
  );

  const link = document.createElement("a");

  link.download = "edited-image.png";
  link.href = tempCanvas.toDataURL("image/png");

  link.click();
});