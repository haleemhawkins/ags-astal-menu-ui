# AGS / Astal Menu UI

A lightweight status bar for the [Hyprland](https://hyprland.org/) Wayland compositor, built with **AGS** (Aylur's GTK Shell) and the **Astal** widget toolkit.

**AGS** (Aylur's GTK Shell):
> https://aylur.github.io/ags/

**Astal:**
> https://aylur.github.io/astal/

**Current Look and Feel:**
> ![screenShot250308_20-18-33](https://github.com/user-attachments/assets/297c68e3-4a0c-4e17-8948-c1269e3fc5b8)

---

## Code Walkthrough

### Project Structure

```
.
├── app.ts                   # Entry point – bootstraps the app
├── style.scss               # Global styles (glassmorphism theme)
├── env.d.ts                 # TypeScript module declarations
├── tsconfig.json            # TypeScript / JSX compiler config
├── package.json             # Package name and Astal dependency
└── widget/
    ├── Bar.tsx              # Top bar layout (the root widget)
    ├── HyprWorkspaces.tsx   # Hyprland workspace switcher
    ├── DateTime.tsx         # Live clock with date tooltip
    ├── AudioSlider.tsx      # Volume slider with mute toggle
    └── Utilities.tsx        # iPad display-scaling shortcuts
```

---

### `app.ts` — Entry Point

```ts
App.start({
    css: style,           // inject compiled style.scss at startup
    main() {
        App.get_monitors().map(Bar)   // create one Bar per connected monitor
    },
})
```

`App.start` is the Astal bootstrap function. It:
1. Compiles and injects `style.scss` as inline CSS into every GTK window.
2. Calls `main()`, which queries every connected GDK monitor and renders a `Bar` window on each one.

---

### `widget/Bar.tsx` — Top Bar Layout

`Bar` is a function component that receives a `Gdk.Monitor` and returns an Astal `<window>`.

Key properties on the window:
| Property | Value | Effect |
|---|---|---|
| `exclusivity` | `EXCLUSIVE` | Reserves space so other windows don't overlap the bar |
| `anchor` | `TOP \| LEFT \| RIGHT` | Pins the bar to the full width of the top edge |
| `gdkmonitor` | passed in | Renders on the correct physical screen |

Inside the window, a `<centerbox>` divides the bar into three zones:

| Zone | Alignment | Widget |
|---|---|---|
| Left | `START` | `<Workspaces />` — workspace buttons |
| Center | `CENTER` | `<DateTime />` — clock |
| Right | `END` | `<Utilities />` then `<AudioSlider />` |

---

### `widget/HyprWorkspaces.tsx` — Workspace Switcher

```ts
const hypr = Hyprland.get_default();   // singleton IPC connection to Hyprland
```

`bind(hypr, "workspaces")` creates a reactive binding: whenever Hyprland adds or removes a workspace, the box re-renders automatically.

Inside `.as(...)`, workspaces are:
1. **Filtered** — IDs in the range `[-99, -2]` are Hyprland's internal "special" workspaces and are hidden.
2. **Sorted** by numeric ID so they always appear in order.
3. **Mapped** to `<button>` elements. Each button:
   - Gets the CSS class `"focused"` when its workspace is the active one (via a second `bind` on `focusedWorkspace`).
   - Calls `ws.focus()` when clicked to switch to that workspace.

---

### `widget/DateTime.tsx` — Clock

```ts
const time = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().format("%H:%M")!);

const date = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().format("%A %B %d, %Y")!);
```

`Variable.poll` re-evaluates its callback every 1 000 ms and stores the result reactively. The `<label>` displays:
- **`label`** — the current time in `HH:MM` format, updated every second.
- **`tooltipText`** — the full date (`Wednesday February 26, 2025`), shown on hover.

---

### `widget/AudioSlider.tsx` — Volume Control

The widget talks to the default audio output device via the **AstalWp** (WirePlumber) GObject introspection library.

```ts
const speaker = Wp.get_default()?.audio.defaultSpeaker!;
```

**Mute toggle** — `toggleMute()`:
- When unmuting, it restores `previousVolume` (the volume saved before muting).
- When muting, it saves the current volume to `previousVolume`, sets the volume to `0`, and flips `speaker.mute`.

**Slider** — `<slider>` is bound to `speaker.volume` reactively, so it always reflects the true hardware state. Dragging it calls `setVolume` which writes back to WirePlumber.

**Icon** — `bind(speaker, "volumeIcon")` automatically switches the icon between muted / low / medium / high states as the volume changes.

---

### `widget/Utilities.tsx` — Display Scaling Shortcuts

Two buttons issue `hyprctl keyword monitor` commands to change the scaling factor of the monitor named `DP-2` (an iPad used as a secondary display via Sidecar or similar):

| Button | Emoji | Scale | Extra command |
|---|---|---|---|
| `ipadScale100` | 🌺 | `1` (100 %) | — |
| `ipadScale200` | 🏵️ | `2` (200 %) | `waypaper --restore` re-applies the wallpaper after rescaling |

`exec()` from Astal runs shell commands synchronously from GJS without spawning a shell.

---

### `style.scss` — Glassmorphism Theme

The bar adopts a modern **glassmorphism** aesthetic:

| CSS technique | Where used |
|---|---|
| Semi-transparent `rgba` background | `centerbox` background, buttons |
| `backdrop-filter`-style blur (handled by the compositor) | `window.Bar` transparent background |
| `box-shadow: 0 4px 30px rgba(0,0,0,0.1)` | `centerbox` and buttons |
| `border: 1px solid rgba(255,255,255,0.243)` | `centerbox` and buttons |
| `border-radius: 8px` | All rounded corners |

Color variables from the [Rosé Pine](https://rosepinetheme.com/) palette:
- `$pine` (`#3e8fb0`) — focused workspace text, slider trough
- `$foam` (`#9ccfd8`) — slider fill highlight

The `.AudioSlider` section resets all GTK default styles with `* { all: unset }` and then manually restores only what is needed, giving full control over the slider's `trough` and `highlight` sub-elements.

---

### `tsconfig.json` — Build Configuration

| Option | Value | Why |
|---|---|---|
| `jsx` | `react-jsx` | Enables JSX syntax (`.tsx` files) |
| `jsxImportSource` | `astal/gtk3` | Points JSX to Astal's GTK 3 factory instead of React |
| `moduleResolution` | `Bundler` | Matches the AGS bundler's module resolution strategy |
| `target` | `ES2022` | GJS ships a modern JS engine; no need to down-compile |

### `env.d.ts` — Type Declarations

Tells TypeScript how to treat non-JS imports so the bundler can inline them:
- `*.scss`, `*.css`, `*.blp` → resolved to a `string` (the compiled CSS/Blueprint content)
- `inline:*` → any module prefixed with `inline:` is treated as a raw string
- `SRC` → a global constant injected by the AGS bundler with the project's source path
