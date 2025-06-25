import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import Workspaces from "./HyprWorkspaces"
import AudioSlider from "./AudioSlider"
import DateTime from "./DateTime"
import Utilities from "./Utilities"

const Bar = (gdkmonitor: Gdk.Monitor) => {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
    return (
        <window
            className="Bar"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={App}>
            <centerbox>
                <box hexpand halign={Gtk.Align.START}>
                    <Workspaces />
                </box>
                <box hexpand halign={Gtk.Align.CENTER} >
                    <DateTime />
                </box>
                <box hexpand halign={Gtk.Align.END} >
                    <Utilities />
                    <AudioSlider />
                </box>
            </centerbox>
        </window>
    )
}
export default Bar;