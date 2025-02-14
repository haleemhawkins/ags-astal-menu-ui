import { GLib, Variable } from "astal";
import { Gtk } from "astal/gtk3";


const DateTime = (): Gtk.Widget => {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format("%H:%M")!);
    return (
        <label
            label={time()}
        />
    )
};

export default DateTime;