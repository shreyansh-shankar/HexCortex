# Cortex

*A modular cybersecurity workspace that thinks in workflows, not words.*

---

### Overview

**Cortex** is a **microservice-based cybersecurity automation system** built to make complex reconnaissance and analysis workflows simple, explainable, and repeatable.
Instead of relying on an unpredictable AI core, Cortex uses a **rule-driven knowledge base** and **context-aware logic engine** to guide users through each stage of their security assessment — from discovery to reporting.

Cortex acts as a **thinking environment** rather than a chatbot. It understands what tools have been run, what outputs were found, and what logical next steps make sense — all while keeping data structured and reusable across sessions.

---

### Core Features

* **Modular Architecture** – Each component (scanner, parser, KB, UI) is an independent microservice communicating via internal APIs.
* **Knowledge Base (KB)** – Stores tool information, use-cases, syntax patterns, and recommended follow-ups in a structured format.
* **Tool Executor** – Runs CLI tools like `nmap`, `nikto`, or `dirsearch` in isolated sandboxes and converts results into machine-readable data.
* **Rule-Based Suggestion Engine** – Determines the best next commands based on parsed outputs and knowledge base logic.
* **Session Context Memory** – Saves all scans, parsed results, and decisions for traceable workflows and automated report generation.
* **Integrated Desktop Terminal** – A full-featured shell (supporting `nano`, `ssh`, `htop`, etc.) combined with side panels for results, history, and tool suggestions.

---

### Example Flow

1. User inputs a target → `192.168.1.5`
2. Cortex checks KB → suggests `nmap -sV {target}`
3. Executor runs Nmap → parses results (ports 22, 80, 443 open)
4. Suggestion Engine → proposes `nikto -h {target}` for port 80
5. User runs Nikto → results stored in workspace context
6. Cortex keeps the history, results, and next logical steps

Each session evolves into a **structured analysis tree**, giving both clarity and automation.

---

### Philosophy

Cortex isn’t built to replace the human hacker — it’s built to **enhance their thinking process**.
It brings **structure, repeatability, and context-awareness** to security testing while staying **fully deterministic and explainable**.
No hallucinations, no black-box decisions — just clean logic, modular design, and the freedom to grow.
