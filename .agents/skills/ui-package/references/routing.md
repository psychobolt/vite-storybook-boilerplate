# UI Implementation Routing

Use this reference to classify a UI implementation unit before selecting its
procedure. Read the target package's local guidance and public contract first;
treat filenames and folder structure as organizational clues. Determine the
unit type and ownership from its public contract, implementation, exports, and
established package conventions.

## Unit selection

- Use `ui-element` for the smallest reusable, framework-neutral unit with one
  stable HTML or template contract. A collection or fixed internal layout alone
  does not make a unit a composite.
- Use `ui-composite` for a framework-neutral contract that assembles multiple
  independently meaningful elements or composites, or coordinates their state,
  events, behavior, or accessibility.
- Use `ui-component` for framework-specific UI behavior or an adapter built
  from a framework-neutral element or composite.
- If an element, composite, or component is application-owned or contains
  application-specific routing, business data, permissions, application-owned
  state, or workflows, do not use a UI-package procedure. Read the
  [app-package routing guidance](../../app-package/references/routing.md) for
  the application-package boundary; that workflow may use `app-component` for
  the implementation unit.

## Handoffs and derivation

- When a framework-specific component has a corresponding base element or
  composite, derive its semantics and styles from that base and adapt its
  public API to the target framework's prop, event, slot, or children
  conventions. Do not assume the adapter must expose the same API shape or
  import an internal base template at runtime. Use the component procedure for
  the framework adapter.
- If an element's contract begins coordinating multiple independently
  meaningful units, hand off to `ui-composite`. If a composite exposes one
  stable element contract, hand off to `ui-element`.
- If a framework-neutral element or composite is requested to provide
  framework-specific behavior, hand off to `ui-component`.
- If a UI implementation is application-owned, leave the UI-package workflow
  and hand off to `app-package`; do not construct an `app-component` from a UI
  package or UI-unit skill.
- After classifying the unit, invoke only the procedure required by that
  classification. Do not invoke skills in sequence by default. Use the unit's
  public contract and ownership boundary to determine whether a handoff or
  derivation is required.
