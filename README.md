<div align="center">

<!-- ══════════════════════════════════════════════════════════ -->
<!--                     HERO SECTION                          -->
<!-- ══════════════════════════════════════════════════════════ -->

# 🔭 Redshift Predictor — SDSS MLR

### Photometric Redshift Estimation via Multiple Linear Regression

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-63b3ed?style=for-the-badge&logoColor=white)](https://konton-chan.github.io/MLR_Redshift_Using_R/)
[![Notebook](https://img.shields.io/badge/📓_Notebook-Google_Colab-f9ab00?style=for-the-badge&logo=googlecolab&logoColor=white)](https://colab.research.google.com/github/Konton-Chan/MLR_Redshift_Using_R/blob/main/Redshift_MLR.ipynb)
[![Language](https://img.shields.io/badge/R-276DC3?style=for-the-badge&logo=r&logoColor=white)](https://www.r-project.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-68d391?style=for-the-badge)](LICENSE)

<br/>

> *Predict the cosmological redshift of galaxies, quasars, and stars*
> *from five SDSS photometric band magnitudes — entirely in the browser.*

<br/>

```
z = b₀ + b₁·u + b₂·g + b₃·r + b₄·i + b₅·z_band
```

<br/>

</div>

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                   QUICK STATS                             -->
<!-- ══════════════════════════════════════════════════════════ -->

<div align="center">

|  📊 Dataset  |  🎯 Best R²  |  📐 RMSE  |  🔢 Models  |  🌌 Objects  |
|:---:|:---:|:---:|:---:|:---:|
| SDSS DR | **0.7246** (GALAXY) | **0.1354** | 8 MLR | 99,992 |

</div>

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                   TABLE OF CONTENTS                       -->
<!-- ══════════════════════════════════════════════════════════ -->

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Live Demo](#-live-demo)
- [📁 Project Structure](#-project-structure)
- [🌌 Dataset](#-dataset)
- [🔬 Methodology](#-methodology)
- [📊 Results](#-results)
- [📐 Prediction Interval](#-prediction-interval)
- [🧠 Design Decisions](#-design-decisions)
- [🌐 Web Application](#-web-application)
- [⚙️ How to Run](#️-how-to-run)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔮 Future Work](#-future-work)
- [📖 References](#-references)

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                      OVERVIEW                             -->
<!-- ══════════════════════════════════════════════════════════ -->

## ✨ Overview

Measuring **spectroscopic redshift** requires dedicated telescope time and per-object spectral decomposition. This project demonstrates that **five broadband magnitudes** from the Sloan Digital Sky Survey (SDSS) are sufficient to predict the redshift of **galaxies** with R² = 0.72 using plain Multiple Linear Regression — and delivers the result inside an interactive browser app with zero backend infrastructure.

### What makes this project stand out

- 🔭 **Physics-informed data cleaning** — distinguishes statistically extreme but physically valid observations from true sensor errors
- 📐 **Statistically correct uncertainty** — reports **Prediction Intervals** (not Confidence Intervals) for single-object predictions, with parameters pre-computed in R and exported to JSON
- 🎨 **Spectral colour simulation** — Doppler colour strip, SED profiles, emission-line shift visualizer, and cosmic distance timeline — all rendered in `<canvas>` with no external libraries
- ⚡ **100% client-side** — model inference runs entirely in the browser from 3 lightweight JSON files

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                     LIVE DEMO                             -->
<!-- ══════════════════════════════════════════════════════════ -->

## 🚀 Live Demo

<div align="center">

### 👇 Try it now

**[https://konton-chan.github.io/MLR_Redshift_Using_R/](https://konton-chan.github.io/MLR_Redshift_Using_R/)**

</div>

<br/>

| Step | Action | Result |
|:----:|--------|--------|
| **01** | Select object class (GALAXY / QSO / STAR) | Loads the correct 5-band model |
| **02** | Enter u, g, r, i, z magnitudes (10 – 30) | Input validated instantly |
| **03** | Click **✦ Predict Redshift** | Animated z value + full MLR equation |
| **04** | Explore simulations | Doppler strip · SED · Spectral lines · Cosmic distance |

> 📸 **Screenshot:** Add a screenshot of the web app here after deployment.
> *(Tip: use `![App Screenshot](Image/screenshot.png)` once you have the image.)*

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                  PROJECT STRUCTURE                        -->
<!-- ══════════════════════════════════════════════════════════ -->

## 📁 Project Structure

```
R_REDSHIFT_MLR/
│
├── 📄 index.html                   # Single-page app UI (311 lines)
├── 📝 README.md                    # This file
├── ⚙️  script.js                    # Prediction engine + 4 canvas simulations (1,139 lines)
├── 🎨 style.css                    # Dark space theme + responsive layout (514 lines)
│
├── 💾 Backup/                      # Version backups of source files
│
├── 📓 Colab/
│   └── Redshift_MLR.ipynb          # Full analysis pipeline — Google Colab (75 cells)
│       ├── Cells 01–04             General setup (Drive mount, R extension, packages, raw data)
│       ├── Cells 05–15             EDA on raw data + outlier analysis (391 flagged rows)
│       ├── Cells 16–21             Data cleaning (remove 8 rows) + load 4 class datasets
│       ├── Cells 22–45             Post-cleaning EDA (boxplots, statistics, histograms, relationships)
│       ├── Cells 46–48             Train/test split (seed=64, 80/20)
│       ├── Cells 49–58             Train 8 MLR models + evaluate (R², RMSE, MAE, SMAPE)
│       ├── Cells 59–60             Save .rds models + export JSON (digits=8, pi_half_width)
│       └── Cells 61–63             Load models + predict new objects (CI + PI)
│
├── 📂 Data/                        # Datasets (synced from Google Drive)
│   ├── Rawdata/
│   │   └── dataset_raw.csv         # Original SDSS dataset (100,000 rows × 18 cols)
│   ├── Cleandata/                  # After removing 8 true errors → 99,992 rows
│   │   ├── dataset_clean.csv
│   │   ├── dataset_clean_GALAXY.csv
│   │   ├── dataset_clean_QSO.csv
│   │   └── dataset_clean_STAR.csv
│   └── Splitdata/                  # 80/20 train-test split (seed=64)
│       ├── All/
│       ├── Galaxy/
│       ├── QSO/
│       └── Star/
│
├── 📄 Document/                    # Project reports and documentation
│
├── 🖼️  Image/
│   └── Konton_Chan.gif             # Mascot — GPU-accelerated sine float animation
│
├── 🤖 Model/
│   ├── json/                       # Deployed to GitHub Pages (loaded by script.js)
│   │   ├── Galaxy/
│   │   │   └── MLR_GALAXY_5band.json   # Coefficients + PI params (8-digit precision)
│   │   ├── QSO/
│   │   │   └── MLR_QSO_5band.json
│   │   └── Star/
│   │       └── MLR_STAR_5band.json
│   └── rds/                        # Trained R model objects (not served to browser)
│       ├── All/
│       ├── Galaxy/
│       ├── QSO/
│       └── Star/
│
└── 📊 Result/                      # EDA plots and model performance outputs
    ├── Analyze_the_data_before_cleaning/
    ├── Analyze_the_data_after_cleaning/
    └── Model_performance/
        ├── All/
        ├── Galaxy/
        ├── QSO/
        ├── Star/
        └── Summary/
```

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                       DATASET                             -->
<!-- ══════════════════════════════════════════════════════════ -->

## 🌌 Dataset

**Source:** [Sloan Digital Sky Survey (SDSS)](https://www.sdss.org/) — DR photometric catalog

| Property | Value |
|----------|-------|
| Raw rows | 100,000 |
| Rows after cleaning | **99,992** (8 true errors removed) |
| Features | 18 columns |
| Target variable | `redshift` (spectroscopic z) |
| Predictors used | `u`, `g`, `r`, `i`, `z` magnitudes |

### Class Distribution

```
GALAXY ████████████████████████████████████  59,443  (59.4%)
STAR   ████████████                          21,591  (21.6%)
QSO    ███████████                           18,958  (19.0%)
                                            ────────────────
TOTAL                                        99,992  (100%)
```

### SDSS Photometric Bands

| Band | Central λ | Spectral Region | Valid Input Range |
|:----:|:---------:|:---------------:|:----------------:|
| **u** | 3551 Å | Ultraviolet | 10 – 30 mag |
| **g** | 4686 Å | Blue / Green | 10 – 30 mag |
| **r** | 6165 Å | Red | 10 – 30 mag |
| **i** | 7481 Å | Near Infrared | 10 – 30 mag |
| **z** | 8931 Å | Infrared | 10 – 30 mag |

### Data Cleaning

IQR-based outlier detection flagged **391 rows**. Each was classified against physical constraints (10 ≤ mag ≤ 30, error flag = −9999):

| Band | IQR Fence Lower | IQR Fence Upper | IQR Outliers | False Positives | True Errors |
|:----:|:--------------:|:--------------:|:------------:|:---------------:|:-----------:|
| u | 15.35 | 28.69 | 56 | 53 | **3** |
| g | 14.23 | 26.86 | 99 | 96 | **3** |
| r | 13.59 | 25.95 | 132 | 131 | **1** |
| i | 13.06 | 25.18 | 198 | 193 | **5** |
| z | 12.65 | 24.58 | 320 | 318 | **2** |

> **Decision:** Only the **8 true error rows** were removed. False positives are physically real (bright nearby galaxies, saturated stars) and were retained in the dataset.

**Examples of removed rows:**
- Row 1 — QSO, `i = 30.1546` → exceeds the 30 mag sensor ceiling
- Row 2 — STAR, `r = 9.82`, `i = 9.47`, `z = 9.61` → three bands below the 10 mag saturation limit

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                    METHODOLOGY                            -->
<!-- ══════════════════════════════════════════════════════════ -->

## 🔬 Methodology

### Model Formula

```
z = b₀ + b₁·u + b₂·g + b₃·r + b₄·i + b₅·z_band + ε
```

### Training Strategy

Two model variants were trained on each of four class subsets, yielding **8 models** total:

| Variant | Predictors | Count |
|---------|-----------|:-----:|
| `MLR_*_all` | alpha, delta, u, g, r, i, z, run_ID, cam_col, field_ID, plate, MJD, fiber_ID | 13 |
| `MLR_*_5band` ✅ | u, g, r, i, z | 5 |

**Split:** 80 / 20 · `set.seed(64)` · implemented in R

| Dataset | Train | Test |
|---------|------:|-----:|
| dataset_clean | 79,993 | 19,999 |
| dataset_GALAXY | 47,554 | 11,889 |
| dataset_QSO | 15,166 | 3,792 |
| dataset_STAR | 17,272 | 4,319 |

### Why SMAPE instead of MAPE

STAR objects have redshift z ≈ 0. Standard MAPE divides by the actual value, causing it to diverge:

```
# MAPE disaster example
actual = 0.000050, predicted = 0.000063
MAPE   = |0.000050 - 0.000063| / 0.000050 × 100 = 26%  ← seems fine

actual = 0.000000, predicted = 0.000010
MAPE   = |0| / |0| × 100  →  Infinity / NaN
```

**SMAPE** was used instead — it divides by the *sum* of actual and predicted:

```
SMAPE = mean( 2·|actual − predicted| / (|actual| + |predicted|) × 100 )
```

This bounds the metric to **[0%, 200%]** regardless of near-zero targets.

| Model | MAPE (before) | SMAPE (after) |
|-------|:------------:|:-------------:|
| MLR_clean_all | **318,566%** ❌ | **83.3%** ✅ |
| MLR_GALAXY_5band | 708% ❌ | **30.2%** ✅ |
| MLR_QSO_5band | 116% | **38.5%** ✅ |
| MLR_STAR_5band | Inf / NaN ❌ | 127% ✅ |

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                       RESULTS                             -->
<!-- ══════════════════════════════════════════════════════════ -->

## 📊 Results

### Test Set Performance (All 8 Models)

| Model | Dataset | R² | Adj R² | RMSE | MAE | SMAPE |
|-------|---------|:--:|:------:|:----:|:---:|:-----:|
| MLR_clean_all | dataset_clean | 0.2898 | 0.2894 | 0.6102 | 0.3624 | 83.3% |
| MLR_clean_5band | dataset_clean | 0.2856 | 0.2855 | 0.6135 | 0.3654 | 82.4% |
| MLR_GALAXY_all | dataset_GALAXY | 0.7488 | 0.7485 | 0.1319 | 0.0812 | 29.5% |
| **MLR_GALAXY_5band** ✅ | **dataset_GALAXY** | **0.7246** | **0.7245** | **0.1354** | **0.0834** | **30.2%** |
| MLR_QSO_all | dataset_QSO | 0.1438 | 0.1409 | 0.8521 | 0.6084 | 38.2% |
| **MLR_QSO_5band** ✅ | **dataset_QSO** | **0.1436** | **0.1430** | **0.8522** | **0.6098** | **38.5%** |
| MLR_STAR_all | dataset_STAR | 0.0612 | 0.0583 | 0.000446 | 0.000277 | 127% |
| **MLR_STAR_5band** ✅ | **dataset_STAR** | **0.0125** | **0.0113** | **0.000457** | **0.000284** | — |

> ✅ = **Selected for deployment** — 5-band model, R² gain vs. all-feature variant is < 0.02 threshold.

### R² Visual Summary

```
GALAXY  ████████████████████████████████████░░░░  0.7246  ★ Deployed
QSO     ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0.1436  (weak — non-linear z range)
STAR    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0.0125  (z ≈ 0 by physics — use RMSE)
```

### Valid Prediction Range

| Class | Reliable z Range | Notes |
|:-----:|:----------------:|-------|
| GALAXY | **0.0 – 2.0** | Trained on z = 0–0.82; extrapolates reasonably to z ≈ 2 |
| QSO | **0.0 – 7.0** | Low reliability (R² = 0.14); use with caution |
| STAR | **z ≈ 0** | Not a redshift prediction — model always outputs z ≈ 0 by design |

> ⚠️ Inputs outside the training range (very blue/red band colours) may produce unreliable extrapolations. The web app displays a warning banner for GALAXY predictions outside z = 0–2 and QSO predictions outside z = 0–7.

### Deployed Model Equations (Exact Coefficients)

These are the exact equations used in production — values exported from R at 8-digit precision.

**GALAXY** *(R² = 0.7246, RMSE = 0.1354)*
```
z = -1.78174828
    - 0.00620087 × u
    + 0.02393263 × g
    + 0.14824592 × r
    - 0.01452566 × i
    - 0.04263688 × z_band
```

**QSO** *(R² = 0.1436, RMSE = 0.8522)*
```
z = [b0_QSO]
    + [b1_QSO] × u
    + [b2_QSO] × g
    + [b3_QSO] × r
    + [b4_QSO] × i
    + [b5_QSO] × z_band
```
*(exact values in `Model/json/QSO/MLR_QSO_5band.json`)*

**STAR** *(z ≈ 0 by definition)*
```
z = 0.000000   (all coefficients set to 0 — no cosmological redshift)
```

### Why GALAXY Works · Why QSO Does Not

| | GALAXY | QSO |
|--|--------|-----|
| **z range in training data** | 0.0 – 0.82 | 0.0 – 7.01 |
| **Dominant spectral features** | 4000 Å break, Balmer series | Broad, variable emission lines |
| **Linearity of colour–z relation** | ✅ Approximately linear | ❌ Highly non-linear |
| **MLR suitability** | ✅ Good fit | ❌ Model too simple |
| **Recommendation** | Use with confidence | Use as rough estimate only |

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                  PREDICTION INTERVAL                      -->
<!-- ══════════════════════════════════════════════════════════ -->

## 📐 Prediction Interval

This project reports **Prediction Intervals (PI)** — not Confidence Intervals (CI) — when predicting the redshift of a single new object.

| | CI | PI |
|--|:--:|:--:|
| **Quantifies** | Uncertainty of the *mean* prediction | Range where a *single new observation* will fall |
| **Correct for** | Average over many objects | One specific new object |
| **Width** | Narrow | Wide |
| **This project uses** | — | ✅ |

### Formula

```
PI = pred ± t(0.975, df) × σ × √(1 + 1/n)
```

This is algebraically identical to R's `predict(..., interval = "prediction", level = 0.95)`.

Parameters are pre-computed in Colab (Cell 26) and stored in each JSON model file as `pi_half_width`, so the browser reads them directly without recomputing.

### Pre-computed Parameters (MLR_GALAXY_5band)

| Parameter | Value |
|-----------|------:|
| n_train | 47,554 |
| Residual SE (σ) | 0.13920465 |
| df_residual | 47,548 |
| t-crit t(0.975, df) | 1.96001388 |
| **PI half-width** | **0.27284592** |

### Example: CI vs PI

Input `u=20.14  g=18.32  r=17.41  i=16.93  z=16.60` → predicted **z = 0.159082**

| Interval | Lower | Upper | Width | Interpretation |
|:--------:|:-----:|:-----:|:-----:|---------------|
| CI 95% | 0.157079 | 0.161085 | 0.004006 | Model mean uncertainty |
| **PI 95%** | **−0.113769** | **0.431932** | **0.545701** | Range for this single object |

PI is **~136× wider** than CI.

### Note on Negative Lower Bound

PI lower = −0.114 is **statistically valid**. In astrophysics, z < 0 represents blueshift (object approaching us), which is physically real — just outside the SDSS training range (z ≥ 0). The web application shows a physics note explaining this, and the Doppler slider lower limit is clamped to show the strip correctly.

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                  DESIGN DECISIONS                         -->
<!-- ══════════════════════════════════════════════════════════ -->

## 🧠 Design Decisions

This section documents the key choices made throughout the project and the reasoning behind each one.

### 1. Why 5-band model over 13-feature model?

The R² gain from adding 8 survey metadata features (alpha, delta, run_ID, cam_col, field_ID, plate, MJD, fiber_ID) is **less than 0.02** for all classes:

| Class | R² (13 features) | R² (5 bands) | R² gain | Decision |
|:-----:|:----------------:|:------------:|:-------:|:--------:|
| GALAXY | 0.7488 | 0.7246 | +0.024 | 5-band ✅ |
| QSO | 0.1438 | 0.1436 | +0.000 | 5-band ✅ |
| STAR | 0.0612 | 0.0125 | +0.049 | 5-band ✅ |

The 5-band model is simpler, directly applicable to any raw photometric catalog, and avoids embedding survey-specific metadata that would break for non-SDSS inputs.

### 2. Why Prediction Interval instead of Confidence Interval?

When a user types in band magnitudes and asks *"what is the redshift of this specific object?"*, they are asking about **one new observation** — not the average over all objects with those magnitudes. The PI is the statistically correct interval for this use case. CI is ~136× narrower and would be misleadingly precise.

### 3. Why is the Doppler slider range = PI bounds?

The PI defines the plausible redshift range for the predicted object at 95% confidence. Setting the slider to `[z − PI_half, z + PI_half]` lets users physically explore *exactly the range of uncertainty that the model reports* — making the PI visually intuitive rather than just a pair of numbers.

### 4. Why SMAPE instead of MAPE?

MAPE = `|actual − predicted| / |actual|` explodes when `actual ≈ 0`. The STAR class has spectroscopic redshift z ≈ 0.00000–0.00100, making MAPE undefined or > 300,000%. SMAPE divides by `|actual| + |predicted|`, bounding the result to [0%, 200%] regardless of near-zero targets.

### 5. Why display true PI value even when lower < 0?

Clamping the lower bound to 0 would be statistically dishonest — it would misrepresent the model's actual uncertainty. Instead, the app shows the true statistical value and adds a physics note explaining that z < 0 (blueshift) is physically valid but outside the training range. Users get both the correct number and the correct interpretation.

### 6. Why strip the leading minus when formatted z = −0.000?

Floating-point rounding can produce `−0.0000` from a tiny negative number. Displaying a minus sign on zero is misleading. The `fmtZ()` and `fmtTick()` functions in `script.js` detect `parseFloat(s) === 0` after formatting and remove the leading minus character.

### 7. Why GPU-accelerate the mascot animation?

The mascot floats using a sine wave. If we animated it via CSS `transform` in a `requestAnimationFrame` loop without GPU hints, the browser would trigger layout/paint on each frame. Setting `will-change: transform` and seeding the animation with `translateZ(0)` promotes the element to its own compositor layer, ensuring the float runs at 60 fps without impacting other DOM rendering.

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                  WEB APPLICATION                          -->
<!-- ══════════════════════════════════════════════════════════ -->

## 🌐 Web Application

A fully static, serverless app deployed on **GitHub Pages**.

### Features

| Section | Description |
|---------|-------------|
| 🔘 **Step 01 — Class** | Select GALAXY / QSO / STAR to load the appropriate JSON model |
| 🎛️ **Step 02 — Bands** | Enter u, g, r, i, z (range 10–30); invalid inputs trigger animated shake error |
| ✦ **Predict** | Animated z counter, full MLR equation with substituted values, model metrics |
| 📊 **95% PI Box** | Visual bar: Lower ↔ Upper, width chip, physics note if lower < 0 |
| 🌈 **① Doppler Colour Shift** | Slider scoped to PI range; spectral strip + Hα colour swatch update in real time |
| 📈 **② SED Profile** | Magnitude vs wavelength bar chart across all 5 SDSS bands |
| 🔬 **③ Spectral Line Shift** | 8 emission lines (Ly-α, C IV, C III], Mg II, Hβ, [O III], Hα, [N II]) shifted by predicted z |
| 🌌 **④ Cosmic Distance** | Recession velocity, comoving distance (Mpc / Gly), light travel time (Gyr), scale factor a |
| 📉 **Model Performance** | Animated R² bars for all three object classes |

### Background Animation Layers

The app uses **4 stacked `<canvas>` layers** for the space background — all running in separate animation loops at `z-index` 0 – 100:

| Layer | Canvas ID | Description |
|:-----:|-----------|-------------|
| 0 | `nebula-canvas` | 5 radial-gradient blobs (blue, purple, teal, orange, green) — static, redrawn on resize |
| 1 | `aurora-canvas` | 3 animated sine-wave aurora bands — continuous `requestAnimationFrame` loop |
| 2 | `starfield` | ~2,000 parallax stars in 3 depth layers + shooting stars — mouse/touch parallax |
| 100 | `particle-canvas` | Particle burst on Predict button click — 70 coloured circles with gravity |

### JSON Model Format

Each model is a compact JSON file (~1 KB) exported from R (Cell 26) at 8-digit precision:

```json
{
  "model_name": "MLR_GALAXY_5band",
  "metrics": {
    "r2": 0.72461400,
    "rmse": 0.13541100,
    "residual_se": 0.13920465,
    "df_residual": 47548,
    "t_crit_95": 1.96001388,
    "pi_half_width": 0.27284592
  },
  "coefficients": {
    "b0_intercept": -1.78174828,
    "b1_u": -0.00620087,
    "b2_g":  0.02393263,
    "b3_r":  0.14824592,
    "b4_i": -0.01452566,
    "b5_z": -0.04263688
  }
}
```

### Spectral Boundaries on the Doppler Strip

The strip uses these physical wavelength boundaries to draw dashed guide lines:

| Boundary | z value | Hα observed λ | Label |
|:--------:|:-------:|:-------------:|:-----:|
| Yellow/Orange → Red | z ≈ −0.048 | 6250 Å | `YLW→RED` |
| Visible → Near IR | z ≈ 0.143 | 7500 Å | `VIS→NIR` |
| Near IR → Mid IR | z ≈ 1.133 | 14000 Å | `NIR→MIR` |
| Mid IR → Far IR | z ≈ 6.621 | 50000 Å | `MIR→FIR` |

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                    HOW TO RUN                             -->
<!-- ══════════════════════════════════════════════════════════ -->

## ⚙️ How to Run

### Option A — Use the live site

Just visit **[konton-chan.github.io/MLR_Redshift_Using_R](https://konton-chan.github.io/MLR_Redshift_Using_R/)** — no installation needed.

### Option B — Run locally

```bash
# 1. Clone the repository
git clone https://github.com/Konton-Chan/MLR_Redshift_Using_R.git
cd R_REDSHIFT_MLR

# 2. Serve locally (any static server works)
python3 -m http.server 8080
# → open http://localhost:8080
```

> ⚠️ **Important:** The app fetches `Model/json/*.json` via `fetch()`. You **must** serve it through a local server — opening `index.html` directly as a `file://` URL will fail with CORS errors.

### Option C — Re-run the analysis in Colab

#### Step 1 — Prepare your Google Drive folder structure

Before running the notebook, create the following directories in Google Drive:

```
MyDrive/
└── Redshift_MLR/
    ├── Data/
    │   ├── Rawdata/
    │   │   └── dataset_raw.csv          ← place your SDSS dataset here
    │   ├── Cleandata/                   ← created by Cell 16
    │   └── Splitdata/
    │       ├── All/                     ← created by Cell 46
    │       ├── Galaxy/
    │       ├── QSO/
    │       └── Star/
    ├── Model/
    │   ├── rds/
    │   │   ├── All/                     ← .rds files saved by Cell 59
    │   │   ├── Galaxy/
    │   │   ├── QSO/
    │   │   └── Star/
    │   └── json/
    │       ├── All/                     ← .json files saved by Cell 60
    │       ├── Galaxy/
    │       ├── QSO/
    │       └── Star/
    └── Result/
        ├── Analyze_the_data_before_cleaning/
        ├── Analyze_the_data_after_cleaning/
        └── Model_performance/
            ├── All/
            ├── Galaxy/
            ├── QSO/
            ├── Star/
            └── Summary/
```

> Most folders are created automatically by the notebook cells. Only `Data/Rawdata/` with `dataset_raw.csv` needs to exist before you start.

#### Step 2 — Run the notebook

1. Open `Redshift_MLR.ipynb` in [Google Colab](https://colab.research.google.com)
2. Run **Cell 01** — Mount Google Drive
3. Run **Cell 02** — Load R extension (`%load_ext rpy2.ipython`)
4. Run **Cell 03** — Install R packages (moments, dplyr)
5. Run cells in order: **Cell 01 → Cell 63**

### Colab Cell Reference

| Cells | Section | Purpose |
|-------|---------|---------|
| 01 – 03 | Setup | Mount Drive, R extension, install packages |
| 04 | Raw Data | Load 100,000-row SDSS dataset |
| 05 – 06 | EDA | Boxplots for all 17 numeric features |
| 07 | EDA | Interactive Row Filter (find z = −9999) |
| 08 – 12 | EDA | Outlier rows grouped by band + SED profiles + bar charts |
| 13 – 15 | EDA | False positive investigation + visual re-check plots |
| 16 | Cleaning | Remove 8 true errors → 99,992 rows |
| 17 – 21 | Load | Set paths + load 4 clean class datasets |
| 22 – 29 | Post-EDA | Boxplots × 4 datasets |
| 30 – 33 | Post-EDA | Full statistics (mean, SD, skew, kurtosis, Pearson, CV, Z-score) |
| 34 – 37 | Post-EDA | Statistics graphs (correlation bars, CV, Z-score heatmaps) |
| 38 – 45 | Post-EDA | Histograms + relationship plots × 4 datasets |
| 46 | Split | 80/20 train-test split with seed=64 |
| 47 – 48 | Split | Set paths + load 8 split datasets into R |
| 49 – 56 | Training | Train 8 MLR models (2 per class) + evaluate |
| 57 – 58 | Summary | Final model rankings report + graphs |
| 59 | Save | Export 8 trained models as `.rds` files |
| 60 | Export | Extract coefficients + PI params → 8 JSON files (digits=8) |
| 61 – 62 | Load | Set model paths + load all 8 models from Drive |
| 63 | Predict | Apply model to new object — shows CI and PI |

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                     TECH STACK                            -->
<!-- ══════════════════════════════════════════════════════════ -->

## 🛠️ Tech Stack

### Analysis Pipeline

| Tool | Version | Purpose |
|------|:-------:|---------|
| **R** | ≥ 4.3 | MLR training (`lm()`), PI computation, JSON export (`jsonlite`) |
| **Python** | 3.x | rpy2 bridge, data I/O, interactive widgets |
| **rpy2** | 3.x | Run R code inside Google Colab Python cells via `%%R` magic |
| **ggplot2** | ≥ 3.4 | All EDA visualizations (boxplots, histograms, scatter, heatmaps) |
| **dplyr** | 1.2.0 | Data manipulation, filtering, group operations |
| **tidyr** | — | `pivot_longer()` for plot-ready data reshaping |
| **moments** | 0.14.1 | Skewness and kurtosis computation |
| **patchwork** | ≥ 1.1 | Multi-panel plot composition |
| **jsonlite** | — | Export model coefficients to JSON (`digits=8`) |
| **Google Colab** | — | Cloud notebook environment (Python + R via rpy2) |
| **Google Drive** | — | Persistent storage for datasets, models, results |

### Frontend

| Technology | Purpose |
|-----------|---------|
| **Vanilla HTML / CSS / JS** | Zero-dependency UI — no frameworks, no build step |
| **Canvas 2D API** | All animations and visualizations (6 canvases total) |
| **Google Fonts** | Syne (UI headings) + Space Mono (monospace / data elements) |
| **GitHub Pages** | Static hosting — no backend, no server, no cost |

### Canvas Usage Breakdown

| Canvas | Purpose | Technique |
|--------|---------|-----------|
| `nebula-canvas` | Deep-space nebula background | Radial gradients, resizes on window resize |
| `aurora-canvas` | Animated aurora waves | Sine-wave paths, continuous rAF loop |
| `starfield` | Parallax star field + shooting stars | 3-layer depth, mouse/touch parallax |
| `particle-canvas` | Predict button burst effect | Physics particles (gravity + drag) |
| `doppler-canvas` | Hα spectral colour strip + slider | Per-pixel `wl2rgb()`, boundary dashes, predicted z line |
| `sed-canvas` | SED profile plot | Custom chart with SDSS band highlights |
| `spectral-canvas` | Emission line shift diagram | 8 labelled lines shifted by z |
| `cosmic-canvas` | Cosmic distance timeline | Gradient timeline bar |

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                   FUTURE WORK                             -->
<!-- ══════════════════════════════════════════════════════════ -->

## 🔮 Future Work

- [ ] **Random Forest / Gradient Boosting** — capture non-linear colour–redshift relations, especially for QSO
- [ ] **CNN on SDSS image cutouts** — feature-free deep photometric redshift using raw pixel data
- [ ] **Bayesian Regression** — full posterior uncertainty instead of frequentist PI
- [ ] **Deeper surveys** — extend to DES / Rubin LSST for fainter object populations (r > 24)
- [ ] **Conformal prediction** — distribution-free, coverage-guaranteed prediction sets
- [ ] **Photo-z for high-z quasars** — dedicated model for z > 3 using UV dropout features
- [ ] **Uncertainty-aware UI** — show posterior distribution shape, not just interval bounds

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                      REFERENCES                           -->
<!-- ══════════════════════════════════════════════════════════ -->

## 📖 References

1. York, D.G. et al. (2000). *The Sloan Digital Sky Survey.* The Astronomical Journal, **120**(3), 1579. [doi:10.1086/301513](https://doi.org/10.1086/301513)
2. Montgomery, D.C., Peck, E.A., & Vining, G.G. (2012). *Introduction to Linear Regression Analysis* (5th ed.). Wiley.
3. Collister, A.A. & Lahav, O. (2004). *ANNz: Estimating Photometric Redshifts Using Artificial Neural Networks.* PASP, **116**, 345.
4. Budavári, T. & Szalay, A.S. (2008). *Probabilistic Photometric Redshifts.* The Astrophysical Journal, **679**, 301.
5. SDSS Science Archive Server — [https://www.sdss.org/](https://www.sdss.org/)
6. R Core Team (2023). *R: A Language and Environment for Statistical Computing.* Vienna, Austria.
7. Fukugita, M. et al. (1996). *The Sloan Digital Sky Survey Photometric System.* AJ, **111**, 1748.

---

<!-- ══════════════════════════════════════════════════════════ -->
<!--                       FOOTER                              -->
<!-- ══════════════════════════════════════════════════════════ -->

<div align="center">

<br/>

---

Made with ❤️ and a lot of photons by **[Konton_Chan](https://github.com/Konton-Chan)**

*SDSS Star Classification · Multiple Linear Regression · Redshift Prediction*

*Trained on 99,992 clean SDSS observations · Random seed 64 · 80/20 split*

<br/>

[![Star this repo](https://img.shields.io/github/stars/Konton-Chan/MLR_Redshift_Using_R?style=social)](https://github.com/Konton-Chan/MLR_Redshift_Using_R)

</div>