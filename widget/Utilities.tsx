import { exec, GLib } from "astal";
import { Gtk } from "astal/gtk4";


const Utilities = (): Gtk.Widget => {
    const ipadScale100 = () => {
        exec("hyprctl keyword monitor DP-2,2388x1668@120,auto,1")
    }
    const ipadScale200 = () => {
        exec("hyprctl keyword monitor DP-2,2388x1668@120,auto,2")
        exec("waypaper --restore")
    }
    return (
        <box>
            <button onClick={ipadScale100} tooltipText={"ipad scale 100%"}>
                <label label={"🌺"} />
            </button>
            <button onClick={ipadScale200} tooltipText={"ipad scale 200%"}>
                <label label={"🏵️"} />
            </button>
        </box>
    );
};

export default Utilities