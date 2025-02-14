import { exec, GLib } from "astal";
import { Gtk } from "astal/gtk3";


const Utilities = (): Gtk.Widget => {
    const ipadScale1 = () => {
        exec("hyprctl keyword monitor DP-2,2388x1668@120,auto,1")
    }
    const ipadScale2 = () => {
        exec("hyprctl keyword monitor DP-2,2388x1668@120,auto,2")
        exec("waypaper --restore")
    }
    return (
        <box>
            <button onClick={ipadScale1} tooltipText={"ipad scale 1"}>
                <label label={"🌺"} />
            </button>
            <button onClick={ipadScale2} tooltipText={"ipad scale 2"}>
                <label label={"🏵️"} />
            </button>
        </box>
    );
};

export default Utilities