import { bind } from "astal";
import { Gtk } from "astal/gtk3";
import Wp from "gi://AstalWp"

const AudioSlider = (): Gtk.Widget => {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!;
    let previousVolume = speaker.volume;

    const setVolume = (volume: number) => {
        speaker.volume = volume;
    };

    const toggleMute = () => {
        if (speaker.mute) {
            setVolume(previousVolume);
        } else {
            previousVolume = speaker.volume;
            setVolume(0);
        }
        speaker.mute = !speaker.mute;
    };

    return (
        <box className="AudioSlider">
            <button onClick={toggleMute}>
                <icon icon={bind(speaker, "volumeIcon")} />
            </button>
            <slider
                widthRequest={100}
                onDragged={({ value }: { value: number }) => setVolume(value)}
                value={bind(speaker, "volume")}
            />
        </box>
    );
};

export default AudioSlider;
