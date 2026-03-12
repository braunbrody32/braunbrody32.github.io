# 🧪 Element Sandbox — Recipe Book
### Version 1.7.0

All known combinations that produce new elements. Reactions are probabilistic — they may take a moment to trigger.

---

## 🟤 Powders

| Result | Recipe | Notes |
|--------|--------|-------|
| **Mud** | Dirt + Water | Dirt slowly absorbs nearby water |
| **Dirt** | Mud + Heat (brief) | Mud dries out near Fire / Heater / Lava / Coal |
| **Glass** | Sand + Heater | Sand melts into glass |
| **Glass** | Sand + Lava | Sand melts into glass |
| **Glass** | Sand + Coal (burning) | Coal burns hot enough to melt sand |
| **Rust** | Steel + Water (over time) | Steel slowly corrodes; Saltwater or Blood speeds it up |
| **Charcoal** | Wood (burned) | When Wood ignites, it drops Charcoal in adjacent cells |
| **Ash** | Charcoal (fully burned) | Charcoal burns out into Ash after ~500 frames |
| **Ash** | Coal (fully burned) | Coal burns out into Ash after ~800 frames |

---

## 🧱 Solids

| Result | Recipe | Notes |
|--------|--------|-------|
| **Ice** | Water + Cooler | Water freezes on contact with Cooler |
| **Ice** | Water + Nitrogen | Nitrogen flash-freezes water |
| **Ice** | Saltwater + Cooler | Saltwater also freezes with Cooler |
| **Ice** | Saltwater + Nitrogen | Nitrogen freezes saltwater |
| **Obsidian** | Lava + Water | Lava solidifies when touching water |
| **Obsidian** | Ice + Lava | Ice and lava react to form obsidian + burst of steam |
| **Stone** | Lava + Cooler | Cooler solidifies lava into stone |
| **Stone** | Lava + Nitrogen | Nitrogen rapidly cools lava |
| **Brick** | Mud + sustained Heat | Mud that stays near heat long enough fires into brick |
| **Crystal** | Saltwater + Crystal (nearby) | Crystal slowly grows by converting adjacent saltwater |
| **Concrete** (hardened) | Concrete + Time | Wet concrete hardens automatically after ~180 frames |

---

## 💧 Liquids

| Result | Recipe | Notes |
|--------|--------|-------|
| **Water** | Ice + Fire / Heater / Ember / Coal | Ice melts back to water |
| **Water** | Snow + Fire / Heater / Lava / Ember | Snow melts |
| **Water** | Fog + Cooler | Cold condenses fog into water |
| **Water** | Fog + Nitrogen | Nitrogen condenses fog |
| **Water** | Fog + Ice | Ice condenses nearby fog |
| **Water** | Alcohol + Water | Alcohol dilutes into water on contact |
| **Water** | Blood + Water | Blood dilutes into water over time |
| **Saltwater** | Water + Salt | Salt dissolves into water |
| **Acid** | Water + Sulfur | Sulfur dissolves in water to form sulfuric acid |
| **Oil** | Wax + Fire / Lava / Ember / Heater | Wax melts into oil |
| **Tar** | Oil + extreme Heat (temp ≥ 200) | Oil cracks into tar at very high temperatures |
| **Lava** | Stone + Lava (adjacent, rare) | Lava slowly melts nearby stone |
| **Blood** *(no recipe — placeable)* | — | Spawnable directly; dilutes in water, burns to smoke |
| **Slime** *(no recipe — placeable)* | — | Slowly converts adjacent water into more slime |
| **Mercury** *(no recipe — placeable)* | — | Heavy; sinks under water, alcohol, and blood |

---

## 💨 Gases

| Result | Recipe | Notes |
|--------|--------|-------|
| **Steam** | Water + Fire / Heater / Lava / Ember | Water boils into steam at 100°C |
| **Steam** | Saltwater + Fire / Heater / Lava | Saltwater evaporates at 110°C |
| **Steam** | Alcohol ignition (burst) | Alcohol explosion produces a burst of steam |
| **Steam** | Fog + Heat | Heated fog becomes steam |
| **Smoke** | Wood (heating up) | Smoking wood before it ignites |
| **Smoke** | Charcoal (burning) | Charcoal emits smoke while burning |
| **Smoke** | Coal (burning) | Coal emits heavy smoke |
| **Smoke** | Tar + Fire | Tar burns with lots of smoke |
| **Smoke** | Blood + Fire / Lava / Ember | Blood burns to smoke |
| **Smoke** | Ember (dying) | Ember puffs smoke when it expires |
| **Toxic Gas** | Sulfur + Fire / Heater / Lava / Ember | Sulfur combustion produces toxic fumes |
| **Toxic Gas** | Acid + Steam | Acid reacts with steam to make toxic gas |
| **Toxic Gas** | Superacid + Steam | Stronger reaction than regular acid |
| **Toxic Gas** | Fog + Acid | Acidic fog becomes toxic |
| **Toxic Gas** | Mercury + Heat | Heated mercury evaporates into toxic vapor |
| **Fog** | Steam + Cooler | Steam cools and condenses into fog |

---

## 🔥 Fire & Energy

| Result | Recipe | Notes |
|--------|--------|-------|
| **Fire** | Wood (temp ≥ 100) | Wood catches fire when overheated |
| **Fire** | Charcoal (ignited) | Charcoal ignites from Fire / Lava / Ember |
| **Fire** | Coal (ignited) | Coal ignites from Fire / Lava / Ember / Lightning |
| **Fire** | Oil (temp ≥ 150) | Oil ignites at high temperature |
| **Fire** | Honey + Fire / Lava / Ember | Honey slowly catches fire |
| **Fire** | Tar + Fire / Lava (temp ≥ 120) | Tar ignites intensely |
| **Fire** | Wax + Fire (melts first → oil → fire) | Indirect — wax → oil → fire |
| **Ember** | Charcoal (burning, emitted) | Charcoal sheds embers while burning |
| **Plasma** | Lava + Superacid | Violent reaction produces a plasma burst |

---

## 💥 Explosions

| Result | Recipe | Notes |
|--------|--------|-------|
| **Explosion (small)** | Gunpowder + Fire / Lava / Ember / Lightning | Radius ~4 |
| **Explosion (medium)** | Bomb + Fire / Heater / Lava / Plasma / Ember / Lightning | Radius ~20 |
| **Explosion (large)** | TNT + Fire / Heater / Lava / Plasma / Ember / Lightning | Radius ~10 (TNT > Bomb in density) |
| **Explosion (large)** | Methane + Fire / Lava / Heater / Ember / Lightning | Radius ~6; fills area with fire |
| **Explosion (huge)** | Hydrogen + Fire / Lava / Ember / Lightning | Radius ~10; near Oxygen = produces Water |
| **Explosion (huge)** | Propane + Fire / Ember / Lava / Lightning / Heater | Radius ~8; heavy gas that sinks and pools |
| **Explosion (massive)** | NitroGel + Fire / Ember / Heater / Lava / Acid / Superacid / Plasma / Lightning | Radius ~18; triggered by almost everything |
| **Fire burst** | Alcohol + Fire / Heater / Lava / Ember / Lightning (temp ≥ 80) | Burst of fire + steam in radius ~5 |
| **Fire burst** | Acid + Alcohol | Acid triggers alcohol ignition |
| **Fuse chain** | Fuse + Fire (propagates) | Burning fuse lights adjacent fuse segments |

---

## 🧬 Special / Transformations

| Result | Recipe | Notes |
|--------|--------|-------|
| **Crystal (growth)** | Crystal + Saltwater | Crystal slowly converts neighboring saltwater |
| **Salt** | Saltwater evaporation | ~50% chance when saltwater boils off |
| **Crystal** | Saltwater evaporation | ~30% chance alternative to salt on evap |
| **Rust spreading** | Rust + Steel + Water / Saltwater / Blood | Rust spreads corrosion to adjacent steel |
| **Slime spreading** | Slime + Water | Slime slowly converts adjacent water cells |
| **Virus spreading** | Virus + any non-immune material | Converts neighbors every ~20 frames |
| **Void spreading** | Void + any non-Destroyer material | Void consumes neighbors and spawns more void |
| **Wet Sand** | Sand + Water (prolonged) | Sand darkens after absorbing water (cosmetic) |

---

## 🧲 Absorption

| Absorber | Absorbs | Notes |
|----------|---------|-------|
| **Sponge** | Water, Saltwater, Blood, Slime | Darkens as it fills; max 20 absorptions |
| **Gel** | Water, Blood | Changes color as it absorbs; max 10 |
| **Concrete** | *(hardens on its own)* | Stops flowing after ~180 frames |

---

## ❄️ Cooling / Freezing

| Effect | Recipe |
|--------|--------|
| Water → Ice | Water + Cooler or Nitrogen |
| Saltwater → Ice | Saltwater + Cooler or Nitrogen |
| Lava → Stone | Lava + Cooler or Nitrogen |
| Lava → Obsidian | Lava + Water |
| Fire extinguished | Fire + Nitrogen |
| Ember extinguished | Ember + Water / Saltwater / Blood |
| Methane → Stone (area) | Methane explosion near Cooler has no special rule — but Nitrogen will freeze lava that methane exposes |

---

## ☠️ Destruction Hierarchy

From weakest to strongest dissolving power:

| Agent | Immune To | Dissolves |
|-------|-----------|-----------|
| **Acid** | Glass, Rubber, Obsidian, Diamond, Ceramic, Brick, Steel, Mercury, Crystal, Heater, Cooler, Superacid | Most powders, liquids, organics |
| **Superacid** | Destroyer, Void, Antimatter | Everything acid dissolves + Glass, Rubber, Obsidian, Brick, Ceramic, Steel, Crystal; Diamond (very slowly) |
| **Plasma** | Destroyer, Obsidian, Diamond | Nearly everything; short-lived |
| **Void** | Destroyer | Everything including Plasma; spreads, then dissipates |
| **Antimatter** | Destroyer | Everything including Diamond, Glass, Rubber, Obsidian; brief duration |
| **Destroyer** | Nothing destroys it | Everything without exception |

---

## 📋 Quick Reference — "What makes what?"

```
Dirt + Water           → Mud
Mud + Heat             → Dirt (brief) or Brick (sustained)
Sand + Heat/Lava/Coal  → Glass
Water + Salt           → Saltwater
Water + Sulfur         → Acid
Water + Nitrogen       → Ice
Water + Cooler         → Ice
Saltwater evaporates   → Steam + Salt/Crystal
Lava + Water           → Obsidian
Lava + Cooler/Nitrogen → Stone
Ice + Lava             → Obsidian + Steam
Snow/Ice + Heat        → Water
Fog + Heat             → Steam
Fog + Cold             → Water
Fog + Acid             → Toxic Gas
Steam + Acid           → Toxic Gas
Steam + Cooler         → Fog
Sulfur + Water         → Acid
Sulfur + Fire          → Toxic Gas
Mercury + Heat         → Toxic Gas
Wood burned            → Fire + Charcoal
Charcoal burned        → Ember + Smoke → Ash
Coal burned            → Smoke → Ash
Oil overheated         → Tar
Wax + Heat             → Oil
Steel + Water (time)   → Rust
Rust + Steel + Water   → Rust spreads
Crystal + Saltwater    → Crystal grows
Saltwater + Crystal(evap) → Salt or Crystal
Lava + Superacid       → Plasma
Alcohol + Fire         → Fire burst + Steam
Acid + Steam           → Toxic Gas
Acid + Alcohol         → Explosion
NitroGel + (almost anything) → Massive Explosion
Hydrogen + Fire (+ O₂) → Explosion (+ Water if near Oxygen)
```

---

*Reactions are probability-based and may require sustained contact to trigger.*
*Some elements are only obtainable through reactions, not directly spawned.*
