/**
 * GitHub organisations that have run Google Summer of Code.
 *
 * Matched exactly against a repository's owner, lowercased. It used to be a
 * substring test, which quietly misclassified anything whose owner merely
 * contained one of these strings — 'tor' matched storybookjs, 'react' matched
 * preactjs, 'jax' and 'ros' and 'eff' matched a long tail of unrelated orgs. A
 * GSoC count that silently included Storybook PRs is worse than one that misses
 * an org, so matching is exact and a missing org is fixed by adding it here.
 */
export const GSOC_ORGS = new Set([
    // Major Organizations
    'opensuse', 'mozilla', 'kubernetes', 'apache', 'google', 'tensorflow',
    'gnome', 'kde', 'fedora', 'python', 'numpy', 'django', 'zulip',
    'cncf', 'hashicorp', 'grafana', 'prometheus', 'jenkins', 'gitlab',
    // Cloud Native & DevOps
    'kubeflow', 'kubevirt', 'ceph', 'libvirt', 'asyncapi', 'metacall',
    'prometheus-operator', 'elastic', 'influxdata', 'envoyproxy', 'istio',
    'linkerd', 'fluxcd', 'argoproj', 'crossplane', 'dapr', 'containerd',
    // Linux & OS
    'debian', 'freebsd', 'openbsd', 'haiku', 'nixos', 'unikraft', 'gentoo',
    'archlinux', 'linuxfoundation', 'kernel', 'ubuntu', 'centos', 'alpine',
    // Programming Languages & Compilers
    'llvm', 'gcc', 'rust-lang', 'golang', 'scala', 'kotlin', 'haskell',
    'julia', 'r-project', 'ruby', 'perl', 'lua', 'swift', 'dart', 'nim',
    // Web & Frontend
    'webpack', 'electron', 'vuejs', 'angular', 'nodejs', 'react', 'svelte',
    'neutralinojs', 'postman', 'graphql', 'apollographql', 'prisma', 'nestjs',
    // Standards & Specs
    'json-schema', 'openapi', 'asyncapi', 'w3c', 'whatwg', 'tc39', 'ecma',
    'ietf', 'oasis-open', 'schema-org', 'jsonld', 'rdf',
    // Multimedia & Creative
    'blender', 'gimp', 'inkscape', 'videolan', 'vlc', 'ffmpeg', 'krita',
    'audacity', 'mixxx', 'musescore', 'ardour', 'godot', 'obs-studio',
    // Science & Research
    'scipy', 'pandas', 'matplotlib', 'jupyter', 'opencv', 'openvino',
    'openchemistry', 'bioconductor', 'biopython', 'rdkit', 'astropy',
    'sunpy', 'scikit-learn', 'scikit-image', 'sympy', 'numfocus',
    // Communications
    'matrix', 'rocket.chat', 'mattermost', 'xmpp', 'jitsi', 'signal',
    'element', 'deltachat', 'conversations', 'wire', 'briar',
    // Education & Learning
    'oppia', 'sugarlabs', 'mit-app-inventor', 'learningequality', 'anki',
    'ankidroid', 'moodle', 'ilias', 'openstax', 'openedx', 'kolibri',
    // Productivity & Office
    'libreoffice', 'onlyoffice', 'collabora', 'nextcloud', 'owncloud',
    'cryptpad', 'etherpad', 'joplin', 'logseq', 'obsidian', 'zotero',
    // GIS & Maps
    'openstreetmap', 'osgeo', 'qgis', 'organicmaps', 'osmand', 'maplibre',
    // Healthcare
    'openmrs', 'openemr', 'openhealthcare', 'gnu-health', 'bahmni',
    // Finance & Business
    'mifos', 'openmf', 'erpnext', 'odoo', 'gnucash', 'ledger', 'beancount',
    // Security
    'owasp', 'tor', 'privacytools', 'eff', 'fsf', 'aboutcode', 'snort',
    // Robotics & Hardware
    'ardupilot', 'beagleboard', 'freecad', 'kicad', 'opencad', 'brlcad',
    'openrobotics', 'ros', 'fossi', 'chips-alliance', 'lowrisc', 'openhw',
    // Gaming & Simulation
    'scummvm', 'godotengine', 'openra', 'wesnoth', 'flightgear', 'minetest',
    // Documentation & Wiki
    'wikimedia', 'mediawiki', 'bookbrainz', 'musicbrainz', 'metabrainz',
    // CMS & Web Platforms
    'wordpress', 'drupal', 'joomla', 'plone', 'wagtail', 'strapi', 'ghost',
    // Data & AI
    'sktime', 'mlpack', 'shogun', 'rapids', 'dmlc', 'onnx', 'huggingface',
    'langchain', 'llamaindex', 'keras', 'pytorch', 'jax', 'flax',
    // Testing & Quality
    'checkstyle', 'submitty', 'robolectric', 'selenium', 'cypress', 'jest',
    // Databases
    'postgresql', 'mysql', 'mariadb', 'mongodb', 'redis', 'cockroachdb',
    'timescaledb', 'questdb', 'duckdb', 'sqlite', 'vitess', 'tidb',
    // Official GSoC Orgs (from gsocorganizations.dev)
    'circuitverse', 'fossasia', 'aossie', 'ccextractor', 'kiwix', '52north',
    'jderobot', 'redhenlab', 'catrobat', 'openwisp', 'openfoodfacts',
    'internetarchive', 'creativecommons', 'publiclab', 'chaoss', 'airbyte',
    'phpmyadmin', 'phpbb', 'humanhub', 'discourse', 'flarum', 'antlr',
    // More GSoC 2025 orgs
    'aflplusplus', '3dtk', 'fortran-lang', 'freetype', 'gnss-sdr', 'meshery',
    'metabrainz', 'mixxx', 'matrix', 'fossology', 'ml4sci', 'accord-project',
    'ankidroid-app', 'api-dash', 'aboutcode-org', 'gnu-octave', 'gnu-mailman',
    'merl', 'datafusion', 'alaska', 'apertium', 'openchemistry', 'mantis'
].map((o) => o.toLowerCase()));

export function isGsocOrg(owner: string): boolean {
    return GSOC_ORGS.has(owner.toLowerCase());
}
