import NhsShell from './NhsShell'
import { DocCodeBlock } from './components/DocCodeBlock'

const OWS_INSTALL_URL = 'https://docs.openwallet.sh/install.sh'
const OWS_REPO = 'https://github.com/open-wallet-standard/core'

const installScript = `curl -fsSL ${OWS_INSTALL_URL} | bash`

const afterInstall = `ows --help`

const customInstallDir = `# Optional: install binaries under a custom directory
export OWS_INSTALL_DIR="$HOME/.ows/bin"
curl -fsSL ${OWS_INSTALL_URL} | bash`

export default function NhsOwsApp() {
  return (
    <NhsShell
      title="Open Wallet Standard (OWS) — NHS hackathon use case"
      subtitle={
        'Install the official ows CLI and bindings for agent-friendly wallet automation — complementary to in-browser Tempo wallets in this app.'
      }
    >
      {() => (
        <section className="grid">
          <article className="card">
            <h2>What is OWS?</h2>
            <p>
              <strong>Open Wallet Standard (OWS)</strong> provides tooling around a common wallet surface for apps and{' '}
              <strong>agents</strong>. The reference implementation lives in{' '}
              <a href={OWS_REPO} target="_blank" rel="noreferrer">
                open-wallet-standard/core
              </a>
              . The published installer downloads or builds the <code>ows</code> binary and can add Python/Node bindings and
              drop an agent skill into supported IDEs.
            </p>
            <p className="note">
              Clinical Tempo’s web UI still uses <strong>browser wallets</strong> for Tempo MPP. Use <code>ows</code> when you
              want CLI/agent workflows alongside the same hackathon story.
            </p>
          </article>

          <article className="card">
            <h2>Official install</h2>
            <p>
              One-liner from{' '}
              <a href={OWS_INSTALL_URL} target="_blank" rel="noreferrer">
                {OWS_INSTALL_URL}
              </a>{' '}
              (review the script before piping to <code>bash</code> in sensitive environments).
            </p>
            <DocCodeBlock label="bash" code={installScript} />
          </article>

          <article className="card">
            <h2>Custom install directory</h2>
            <p>
              Default binary path is <code>~/.ows/bin/ows</code>. Override with <code>OWS_INSTALL_DIR</code> (see upstream
              script).
            </p>
            <DocCodeBlock label="bash" code={customInstallDir} />
          </article>

          <article className="card">
            <h2>After install</h2>
            <p>Reload your shell or run <code>source ~/.zshrc</code> (or equivalent), then:</p>
            <DocCodeBlock label="bash" code={afterInstall} />
            <p className="intent">
              The installer may also install Python/Node bindings and copy an <code>ows</code> skill into Cursor, Copilot,
              etc., when those directories exist.
            </p>
          </article>

          <article className="card">
            <h2>Docs &amp; source</h2>
            <ul className="log">
              <li>
                Installer:{' '}
                <a href={OWS_INSTALL_URL} target="_blank" rel="noreferrer">
                  docs.openwallet.sh/install.sh
                </a>
              </li>
              <li>
                Repository:{' '}
                <a href={OWS_REPO} target="_blank" rel="noreferrer">
                  github.com/open-wallet-standard/core
                </a>
              </li>
              <li>
                Long-form in repo: <code>docs/OWS_NHS.md</code>
              </li>
            </ul>
          </article>
        </section>
      )}
    </NhsShell>
  )
}
