# Security Audit Exceptions

Use this file to document temporary exceptions for high/critical vulnerabilities found by `npm audit`.

## Required fields

- Package name
- Advisory/CVE identifier
- Severity
- Justification for exception
- Mitigation in place
- Expiration date
- Approver

## Policy

- CI enforces `npm audit --audit-level=high`.
- Exceptions must be time-bound and reviewed monthly.
- Expired exceptions must fail CI until resolved or renewed.
