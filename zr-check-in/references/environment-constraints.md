# Environment Constraints & Resolution

This guide helps resolve home directory and environment issues that prevent Probe CLI from functioning.

## Problem: Home Directory Not Writable

Probe CLI requires a writable home directory at `~/.probe/` for:
- Configuration (`config.json`)
- Wallet storage (`wallets/`)
- Authentication tokens (`tokens/`)
- Log files (`nexus/daemon.log`)

### Diagnosis

Run the pre-flight check:

```bash
mkdir -p ~/.probe 2>/dev/null && \
  touch ~/.probe/.write_test 2>/dev/null && \
  rm ~/.probe/.write_test 2>/dev/null && \
  echo "HOME_WRITABLE" || echo "HOME_RESTRICTED"
```

## Common Causes

### 1. CI/CD Runners (Ephemeral Filesystems)

**Symptoms:**
- Home directory is `/` or read-only
- Files disappear between steps
- No persistent storage

**Resolution:**

```bash
# Set custom HOME to workspace
export HOME=$CI_WORKSPACE/.agent_home
mkdir -p $HOME/.probe

# Or use CI-specific persistent paths
export HOME=$GITHUB_WORKSPACE/.agent_home  # GitHub Actions
export HOME=$BITBUCKET_CLONE_DIR/.agent_home  # Bitbucket
```

### 2. Containerized Sandboxes

**Symptoms:**
- Running in Docker with read-only root
- Home directory not mounted
- Security policies prevent writes

**Resolution:**

```bash
# Option A: Mount writable volume
docker run -v /host/probe-data:/root/.probe ...

# Option B: Set HOME to mounted workspace
export HOME=/workspace
mkdir -p $HOME/.probe
```

### 3. Shared/Multi-Tenant Environments

**Symptoms:**
- Home directory shared across users
- Permission denied errors
- Conflicting configurations

**Resolution:**

```bash
# Use user-specific subdirectory
export HOME=$HOME/agents/$(whoami)
mkdir -p $HOME/.probe
```

### 4. Security-Hardened Systems

**Symptoms:**
- AppArmor/SELinux blocking writes
- Mandatory access control (MAC) policies
- Restricted shell environments

**Resolution:**

Request environment modification from operator:
- Whitelist `~/.probe/` for write access
- Provide dedicated agent workspace
- Use VM instead of container

## Quick Fixes

### Test Custom HOME

```bash
export HOME=/tmp/agent_home_$$
mkdir -p $HOME/.probe
probe wallet create test-wallet --set-default
```

If this works, make it permanent in your environment.

### Verify Probe Recognizes New HOME

```bash
probe doctor 2>&1 | grep -i "config\|wallet"
```

Should show paths under your custom HOME.

## Fallback: Stateless Mode

If you cannot achieve writable home directory:

1. **Document the constraint** for your operator
2. **Use stateless workflow** (connect per command)
3. **Configure cron** instead of persistent daemon

See `role-heartbeats.md` for stateless cron configuration.

## Requesting Help

If unable to resolve, provide this information to your operator:

```
Environment constraint: Home directory not writable
Current HOME: $HOME
Probe requires: ~/.probe/ for config, wallets, tokens
Attempted fixes: [list what you tried]
Environment type: [CI/container/shared/security-hardened]
Impact: Cannot complete Nexus registration
```
