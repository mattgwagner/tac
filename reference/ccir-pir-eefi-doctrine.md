# CCIR, PIR, FFIR, EEFI — Doctrine Reference for Cadre

A quick-reference card for cadre to clarify the relationships between intelligence/information requirement categories when candidates ask. Current authority: **ADP 6-0** and **FM 6-0**.

## The Four Terms

### PIR — Priority Intelligence Requirement
Intelligence about the **enemy, terrain, weather, or civil considerations** that the commander needs to make a specific decision. PIRs drive the collection plan — they are questions about what you don't know but need to know about the operational environment.

> *Example: "Will the enemy commit his reserve along Route BLUE before H+4?"*

### FFIR — Friendly Force Information Requirement
Information about **your own force** that the commander needs to make decisions. FFIR covers things like friendly unit combat power, sustainment status, key leader casualties, or loss of communications with a subordinate element.

> *Example: "Has any squad fallen below 75% combat strength?"*

### CCIR — Commander's Critical Information Requirement (the umbrella)
The **bundle of PIR + FFIR**. Everything the commander has designated as critical to decision-making, both about the enemy and about our own force.

```
            CCIR
           /    \
        PIR     FFIR
     (enemy /  (friendly
     environ.) force)
```

### EEFI — Essential Elements of Friendly Information
The flip side — information **about your own force that you do NOT want the enemy to know**. EEFIs drive OPSEC, deception, and information protection.

> *Example: "The location and timing of the main effort's river crossing."*

## Quick Mnemonic

| Term | Plain-language meaning |
| --- | --- |
| **PIR** | What I need to know about **them**. |
| **FFIR** | What I need to know about **us**. |
| **CCIR** | The commander's bundle of PIR + FFIR. |
| **EEFI** | What I do NOT want them to know about us. |

## Why It Matters in the OPORD

- **CCIR** is the umbrella heading under **Coordinating Instructions**. Under it, list PIR items (enemy/environment) and FFIR items (friendly force) as separate sub-lists.
- **EEFI** is a separate heading, not nested under CCIR.
- Items reported on CCIR triggers go to the PL/CO **immediately**, day or night, by any means.
- Items protected as EEFI shape OPSEC measures, route selection, and what gets transmitted in the clear.

## Common Candidate Confusion (Watch For These)

1. **"PIR and CCIR are two separate categories."** No — PIR is a subset of CCIR. Together with FFIR, they make up CCIR. If a candidate's OPORD lists them as parallel, coach them through the correct nesting.
2. **"EEFI goes under CCIR."** Older doctrine sometimes lumped EEFI under CCIR. **Current ADP/FM 6-0 keeps EEFI separate** as its own category under information collection / protection.
3. **Mislabeled items.** "Compromise of a squad," "friendly casualties below threshold," or "loss of comms" are **FFIR**, not PIR. "Enemy strength different than estimate" or "civilian presence in the kill zone" are **PIR**.
4. **Too many CCIR.** A CCIR should trigger a real decision the commander would make. A long list of nice-to-knows degrades the value. Keep it focused on what would change the plan.

## Quick Sort Test

When auditing a candidate's CCIR list, ask of each line item:

- **Is it about the enemy, terrain, weather, or civilians?** → PIR
- **Is it about us — our combat power, sustainment, casualties, comms, key leaders?** → FFIR
- **Is it something we are trying to keep the enemy from learning?** → EEFI (and it does not belong in CCIR)

## Authority

- **ADP 6-0**, *Mission Command: Command and Control of Army Forces*
- **FM 6-0**, *Commander and Staff Organization and Operations*
- **ATP 2-01**, *Plan Requirements and Assess Collection* (for the collection-plan side of PIR)
