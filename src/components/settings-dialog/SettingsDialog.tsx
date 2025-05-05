import {
  ChangeEvent,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import "./settings-dialog.scss";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { LiveConfig } from "../../multimodal-live-types";
import VoiceSelector from "./VoiceSelector";
import ResponseModalitySelector from "./ResponseModalitySelector";

export default function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { config, setConfig, connected } = useLiveAPIContext();

  const default_si = "You are a Medical Assistant whose job is to answer questions based on the \
knowledge mentioned in the context of the conversation.\n\n\
Instructions:\n\
   - Never use other knowledge than the one provided in the shared screen, or in the attached document or url.\n\
   - In particular, never answer a question if you cannot find the answer in the shared screen, or in the attached document or url.\n\
   - If it happens, just say 'I don't know'."
  const systemInstruction = useMemo(() => {
    const s = config.systemInstruction?.parts.find((p) => p.text)?.text || default_si;
    return s;
  }, [config]);

  const updateConfig: FormEventHandler<HTMLTextAreaElement> = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const newConfig: LiveConfig = {
        ...config,
        systemInstruction: {
          parts: [{ text: event.target.value }],
        },
      };
      setConfig(newConfig);
    },
    [config, setConfig]
  );

  return (
    <div className="settings-dialog">
      <button
        className="action-button material-symbols-outlined"
        onClick={() => setOpen(!open)}
      >
        settings
      </button>
      <dialog className="dialog" style={{ display: open ? "block" : "none" }}>
        <div className={`dialog-container ${connected ? "disabled" : ""}`}>
          {connected && (
            <div className="connected-indicator">
              <p>
                These settings can only be applied before connecting and will
                override other settings.
              </p>
            </div>
          )}
          <div className="mode-selectors">
            <ResponseModalitySelector />
            <VoiceSelector />
          </div>

          <h3>System Instructions</h3>
          <textarea
            className="system"
            onChange={updateConfig}
            value={systemInstruction}
          />
        </div>
      </dialog>
    </div>
  );
}
