# App Package Routing

Use this reference to distinguish application-package work from
application-owned UI units and reusable package work. Read the nearest
`AGENTS.md` and the package's established contract before routing a request.

## Ownership

- Use `app-package` for package-level application composition, screens, routes,
  workflows, application runtime behavior, and orchestration across app-owned
  and reusable packages.
- Use `app-component` for an application-owned element, composite, or component
  inside an app package. It may contain application-specific routing, business
  data, permissions, application-owned state, or workflows in its UI behavior.
- Use `ui-element`, `ui-composite`, or `ui-component` only when the
  implementation is intended to remain reusable outside the application.
- Use `api-package` for business logic, domain utilities, data access, or
  integration contracts when the code is intended for reuse beyond one app.

## Handoffs

- A screen, route, workflow, or broader application composition remains in
  `app-package`, even when it renders reusable UI or app-owned components.
- When a screen or workflow needs an application-owned UI unit, hand off that
  unit to `app-component` and keep the wider orchestration in `app-package`.
- When an app-owned unit is extracted for reuse, reassess its boundary and hand
  it off to the appropriate UI or API package procedure.
- Do not route from names such as element, composite, or component alone;
  determine ownership from the requested reuse boundary and application
  responsibilities.
