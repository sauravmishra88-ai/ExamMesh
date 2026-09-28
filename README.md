# ExamMesh

## Disaster-Resilient Examination Infrastructure

ExamMesh is a **frontend prototype and visual proof-of-concept** for a proposed disaster-resilient digital examination system.

The prototype is designed to communicate the intended user experience, system workflow, and failure-recovery concept for the **MPOnline Hackathon 2026**.

> **Important:** This repository currently contains only the frontend prototype. No backend, database, real synchronization, authentication, cryptographic verification, or server-failure handling has been implemented yet.

---

## Concept

ExamMesh is designed around the following lifecycle:

**Prevention → Detection → Response → Recovery → Trust**

The core idea is that an infrastructure failure should not automatically destroy the state of an ongoing examination.

The proposed architecture includes:

- Central Examination Server
- Examination Center Edge Node
- Candidate-side local persistence
- Event-based response recording
- Synchronization queue
- Reconciliation engine
- Hash-linked event history for tamper-evident integrity verification

These capabilities are part of the **proposed system architecture** and are not yet implemented in this repository.

---

## Current Prototype

The current repository is a **frontend-only visual prototype**.

It contains UI screens representing:

- Landing / examination entry
- Candidate examination interface
- Admin monitoring dashboard
- Infrastructure failure state
- Continuity mode
- Recovery and synchronization workflow
- Integrity verification / audit view

The screens are intended to demonstrate how the proposed system could look and how the failure-recovery workflow would be presented to users and administrators.

### What currently works

The following are currently available as frontend interactions:

- Navigation between prototype screens
- Examination UI interactions
- Buttons and interface state changes
- Visual representation of server failure
- Visual representation of continuity mode
- Visual representation of recovery
- Visual representation of synchronization
- Visual representation of integrity verification

These interactions are **simulated frontend behavior** and should not be interpreted as real distributed-system functionality.

---

## What is NOT implemented

The current prototype does **not** contain:

- Spring Boot backend
- PostgreSQL database
- Real user authentication
- Real candidate/session management
- Real examination APIs
- Real Center Edge Node
- Real cloud/server communication
- Real synchronization between servers
- Real offline event persistence
- Real reconciliation engine
- Real SHA-256 hash-chain verification
- Real failure detection
- Real disaster recovery
- Real AI/ML functionality

The displayed server states, events, synchronization results, and verification results are **visual representations of the proposed workflow**.

---

## Proposed Production Architecture

The intended full system will eventually contain:

```text
                    CENTRAL SERVER
                  Spring Boot + DB
                         │
                         │ Synchronization
                         ▼
                  CENTER EDGE NODE
                  Local Examination
                    Infrastructure
                         │
                         ▼
                    CANDIDATE
                         │
                         ▼
                 LOCAL EXAM STATE
