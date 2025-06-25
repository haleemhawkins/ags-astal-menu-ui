import { bind } from "astal";
import { Gtk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";

const Workspaces = (): Gtk.Widget => {
    const hypr = Hyprland.get_default();

    // Function to filter and sort workspaces
    const getSortedWorkspaces = (workspaces: Array<{
        focus(): any; id: number
    }>) =>
        workspaces
            .filter(({ id }) => !(id >= -99 && id <= -2))  // Exclude special workspaces
            .sort((a, b) => a.id - b.id);

    return (
        <box className="Workspaces">
            {bind(hypr, "workspaces").as((workspaces) => {
                const sortedWorkspaces = getSortedWorkspaces(workspaces);

                return sortedWorkspaces.map((ws) => (
                    <button
                        className={bind(hypr, "focusedWorkspace").as((fw) => (ws === fw ? "focused" : ""))}
                        onClicked={() => ws.focus()}
                    >
                        {ws.id}
                    </button>
                ));
            })}
        </box>
    );
};

export default Workspaces;
