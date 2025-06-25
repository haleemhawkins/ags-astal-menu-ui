import { GLib, Variable } from "astal";
import { Gtk } from "astal/gtk4";


const DateTime = (): Gtk.Widget => {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%H:%M")!);
    const date = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%A %B %d, %Y")!);
    return (
        <label tooltipText={date()}
            label={time()}
        />
    )
};

export default DateTime;