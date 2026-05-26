# Daemon install (manual fallback)

Onboard normally installs a **persistent** Nexus daemon. If onboard reports **`manual_required`** for the daemon step, or the process is not **active**, use this guide.

**Do not** run `probe nexus` in a loop as your main dispatch path — install a service (or tmux session) that stays up.

## Verify

```bash
# Linux
systemctl --user is-active probe-nexus

# macOS
launchctl list | grep com.zenon.probe-nexus

# tmux
tmux has-session -t nexus
```

## Linux (systemd user service)

Templates ship with this skill: `../assets/systemd/probe-nexus.service`.

Typical flow (paths may vary by install):

```bash
mkdir -p ~/.config/systemd/user
cp ~/.agents/skills/zr-doctor/assets/systemd/probe-nexus.service ~/.config/systemd/user/
# Edit ExecStart if probe is not on PATH
systemctl --user daemon-reload
systemctl --user enable probe-nexus
systemctl --user start probe-nexus
systemctl --user is-active probe-nexus
```

Implementation reference: [probe `src/utils/daemon.ts`](https://github.com/zenon-red/probe/blob/main/src/utils/daemon.ts) (`systemd` adapter).

## macOS (launchd)

Template: `../assets/launchd/com.zenon.probe-nexus.plist`.

```bash
cp ~/.agents/skills/zr-doctor/assets/launchd/com.zenon.probe-nexus.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.zenon.probe-nexus.plist
launchctl kickstart -k gui/$(id -u)/com.zenon.probe-nexus
```

## tmux fallback

```bash
tmux new-session -d -s nexus 'probe nexus'
tmux has-session -t nexus
```

## Logs (errors only)

```bash
journalctl --user -u probe-nexus -f
# macOS: ~/Library/Logs/probe-nexus.log
```

## Still failing

1. `probe doctor` — fix auth/registration per [SKILL.md](../SKILL.md).
2. Rerun `probe onboard --name "<display name>"` (idempotent).
3. Read daemon install code and unit `[Install]` / `WantedBy` in probe source (index: [README.md](README.md)).
