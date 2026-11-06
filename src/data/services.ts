import type {GlyphName} from '../components/Glyph';
import {SERVICES, type Service} from './home';

type Link = {label: string; to: string};

export type ServiceDetail = Service & {
  // What the service covers, in plain terms.
  includes: string[];
  // How it runs, from first contact to done.
  steps: Array<{title: string; line: string}>;
  // What the customer is left with.
  outcomes: string[];
  // Who it is mainly for.
  audience: string[];
  primary: Link;
  secondary: Link;
  // The full write-up. A service that has one is shown as a headline beside its description,
  // then its photo beside "What we cover".
  feature?: {
    headline: string;
    paragraphs: string[];
    // eyebrow: a small label over this item, in place of the shared itemLabel.
    cover: Array<{name: string; line: string; glyph?: GlyphName; eyebrow?: string}>;
    // Heading over the list; "What we cover" unless set.
    listTitle?: string;
    // Show the list as open columns (three across) instead of ruled rows.
    columns?: boolean;
    // In columns, show listTitle above them, and the small label over each item.
    showListTitle?: boolean;
    itemLabel?: string;
    // A closing line at the end of the section.
    note?: string;
    // The stages the service runs through, shown as one line under the list.
    flow?: string[];
    // Where the tall crop of the photo centres, when the subject is off to one side.
    focus?: string;
    // 'stacked': headline and description full width, then the photo beside the list.
    // 'split': text beside the photo, then the list full width underneath.
    // 'table' leaves the photo out and shows the list as a full-width table.
    layout?: 'stacked' | 'split' | 'table';
    // In the stacked layout, put the list on the left and the photo on the right.
    mirror?: boolean;
  };
};

type Extra = Omit<ServiceDetail, keyof Service>;

// The detail behind each "What we do" item on the home page, shown on the Services page.
const DETAILS: Record<string, Extra> = {
  assessment: {
    feature: {
      headline: 'Understand Every Installation Before Making the Next Move.',
      paragraphs: [
        'Every solar installation has its own configuration, equipment and history. Before recommending changes or improvements, Guardian Care helps build a clear picture of what’s already in place.',
        'We capture and organise essential installation information, including equipment details, electrical conditions, system configuration and available energy data. This creates a structured digital record that helps solar businesses and engineers make informed decisions.'
      ],
      cover: [
        {name: 'Equipment Identification', line: 'Record installed solar panels, inverters, batteries and other system components.'},
        {name: 'Electrical Assessment', line: 'Document relevant electrical configurations and existing protective equipment.'},
        {name: 'System Documentation', line: 'Bring installation details, photographs and technical records together.'},
        {name: 'Performance Understanding', line: 'Review available energy information to understand the system’s current condition.'},
        {name: 'Improvement Opportunities', line: 'Identify missing information, potential issues and areas that may need attention.'}
      ],
      focus: 'object-[30%_center]'
    },
    includes: [
      'A survey of panels, inverter, battery, isolators, protection and meter',
      'Electrical checks of connections and protective devices',
      'A review of what the system makes against what it should',
      'How the home uses energy, and what it pays for it',
      'Photos, documents and serial numbers gathered in one place',
      'A complete digital system profile that every later step builds on'
    ],
    steps: [
      {title: 'Tell us about your system', line: 'Online or by phone: when it went in, what is installed and what you have noticed.'},
      {title: 'We assess it on site', line: 'An engineer records the equipment, the electrics and how the system performs.'},
      {title: 'You get clear findings', line: 'A plain-language summary of its condition, with recommendations in order of priority.'}
    ],
    outcomes: ['A digital record of the whole installation', 'A summary you can understand', 'Prioritised, honest recommendations'],
    audience: ['Homeowners', 'Solar businesses', 'Engineers'],
    primary: {label: 'Book an assessment', to: '/contact?service=assessment'},
    secondary: {label: 'Start my free check', to: '/consumer'}
  },
  equipment: {
    feature: {
      headline: 'The Right Equipment. The Right Configuration. Better Energy Performance.',
      paragraphs: [
        'Every installation has different energy requirements. Choosing the right equipment means understanding the existing system, checking compatibility and planning improvements around the customer’s needs.',
        'Guardian Care helps solar businesses manage equipment requirements and installation improvements, from initial assessment through coordination and completion records.'
      ],
      cover: [
        {name: 'Solar Inverters', line: 'String, parallel-connected and hybrid inverter solutions for new and existing installations.'},
        {name: 'Battery Storage', line: 'Energy storage solutions designed to make better use of suitable surplus solar generation.'},
        {name: 'AC-Coupled Storage', line: 'Additional battery storage for compatible existing solar installations.'},
        {name: 'System Upgrades', line: 'Improvements to existing solar configurations, equipment and electrical systems.'},
        {name: 'Protection & Safeguarding', line: 'Review existing protective equipment and identify suitable protection improvements.'},
        {name: 'Installation Records', line: 'Maintain equipment information, installation details and completed-work history.'}
      ],
      flow: ['Identify', 'Evaluate', 'Plan', 'Coordinate', 'Record'],
      mirror: true,
      focus: 'object-[62%_center]'
    },
    includes: [
      'Inverter replacement and upgrades, including hybrid inverters',
      'Battery storage, including AC-coupled batteries for existing systems',
      'Surge protection and other electrical improvements',
      'Compatibility checks before anything is recommended',
      'Installation coordinated with qualified engineers',
      'Completed works recorded in the system profile'
    ],
    steps: [
      {title: 'Identify what is needed', line: 'From the assessment, or from a fault, an upgrade or a new goal such as storage.'},
      {title: 'Recommend and plan', line: 'Equipment that suits the system, the home and the tariff, explained before you decide.'},
      {title: 'Install and record', line: 'The work is coordinated end to end, then logged so the system history stays complete.'}
    ],
    outcomes: ['Equipment that fits the system it joins', 'One point of contact from plan to install', 'A record of every change made'],
    audience: ['Homeowners', 'Solar businesses'],
    primary: {label: 'Talk about equipment', to: '/contact?service=inverter'},
    secondary: {label: 'Inverters & batteries', to: '/equipment'}
  },
  monitoring: {
    feature: {
      headline: 'Every System. Every Reading. One Connected View.',
      paragraphs: [
        'Solar installations generate valuable information every day. But when equipment and monitoring platforms operate separately, understanding the complete energy picture becomes difficult.',
        'Guardian Care connects compatible inverters, batteries, meters and energy-monitoring systems, bringing important installation data into one connected environment.'
      ],
      listTitle: 'What we monitor',
      columns: true,
      itemLabel: 'Monitored',
      cover: [
        {name: 'Solar Generation', line: 'Understand how much electricity the installation produces.', glyph: 'generation'},
        {name: 'Home Consumption', line: 'Track how much energy the property uses.', glyph: 'consumption'},
        {name: 'Grid Imports', line: 'Understand when and how much electricity is purchased from the grid.', glyph: 'import'},
        {name: 'Grid Exports', line: 'Monitor surplus electricity sent back to the grid.', glyph: 'export'},
        {name: 'Battery Performance', line: 'Track battery charge, discharge and available energy information.', glyph: 'storage'},
        {name: 'System Health', line: 'Monitor device status, communication and available system alerts.', glyph: 'health'}
      ],
      layout: 'table'
    },
    includes: [
      'Connection of inverters, batteries and energy meters',
      'Solar generation, home consumption, grid imports and exports',
      'Continuous readings of system health',
      'Device integrations through secure gateways',
      'Live data on a web and mobile dashboard',
      'Monitoring restored where it has stopped working'
    ],
    steps: [
      {title: 'Check compatibility', line: 'We confirm which devices can report, and what is needed to connect them.'},
      {title: 'Connect the system', line: 'Inverters, batteries and meters are linked to Guardian Care.'},
      {title: 'See it live', line: 'Readings flow to your dashboard, and estimates are replaced by real data.'}
    ],
    outcomes: ['A live picture of the whole system', 'Real readings in place of estimates', 'One dashboard for every device'],
    audience: ['Homeowners', 'Solar businesses', 'Engineers'],
    primary: {label: 'See the dashboard', to: '/start'},
    secondary: {label: 'Energy intelligence', to: '/energy-intelligence'}
  },
  intelligence: {
    feature: {
      headline: 'From Energy Data to Intelligent Decisions.',
      paragraphs: [
        'Energy systems produce more information than people can easily interpret. Guardian Care brings AI and energy analytics together to turn that information into meaningful insights and better decisions.',
        'Instead of simply showing numbers and charts, our vision is to help businesses, engineers and homeowners understand what is happening, why it might be happening and what they can do next.'
      ],
      listTitle: 'Our AI capabilities',
      columns: true,
      cover: [
        {name: 'Intelligent Anomaly Detection', line: 'Identify unusual energy patterns and performance changes that may require attention.'},
        {name: 'Fault Intelligence', line: 'Analyse available system information to explain potential faults and possible causes.'},
        {name: 'Performance Intelligence', line: 'Compare actual performance against historical behaviour and expected system performance.'},
        {name: 'Predictive Insights', line: 'Use historical patterns and analytics to help identify potential maintenance requirements earlier.'},
        {name: 'Energy Optimisation', line: 'Identify opportunities to improve energy usage, solar self-consumption and battery utilisation.'},
        {name: 'Personalised Recommendations', line: 'Turn technical information into practical advice that customers can understand.'}
      ],
      note: 'AI doesn’t just help us see what’s happening. It helps us understand what to do next.',
      layout: 'split'
    },
    includes: [
      'Detection of unusual generation, usage or battery behaviour',
      'Potential faults explained in plain language',
      'Performance compared with what the system should produce',
      'Personalised advice on self-use, storage and tariffs',
      'Alerts the moment system health slips',
      'Portfolio-wide insight for solar businesses'
    ],
    steps: [
      {title: 'Learn the baseline', line: 'AI learns how each system normally performs, through the seasons.'},
      {title: 'Spot the change', line: 'Analytics flag anything that drifts from that baseline, early.'},
      {title: 'Explain and advise', line: 'Each finding comes with what it likely means and what to do next.'}
    ],
    outcomes: ['Problems found before they cost you', 'Clear explanations, not raw data', 'Advice that improves performance'],
    audience: ['Homeowners', 'Solar businesses', 'Engineers'],
    primary: {label: 'Explore energy intelligence', to: '/energy-intelligence'},
    secondary: {label: 'Start my free check', to: '/consumer'}
  },
  operations: {
    feature: {
      headline: 'Turn System Insights into Real Action.',
      paragraphs: [
        'Identifying a problem is only the beginning. Solar businesses also need a reliable way to organise maintenance, coordinate engineers and make sure issues move towards resolution.',
        'Guardian Care brings monitoring information and operational workflows together, helping teams manage installations and ongoing service activities more effectively.'
      ],
      listTitle: 'What we manage',
      cover: [
        {name: 'System Alerts', line: 'Organise system notifications and identify issues that require attention.'},
        {name: 'Maintenance Scheduling', line: 'Coordinate inspections, maintenance activities and service appointments.'},
        {name: 'Work Order Management', line: 'Create, assign and track maintenance and engineering tasks.'},
        {name: 'Fault Resolution', line: 'Keep relevant issue information, actions and resolution records together.'},
        {name: 'Service History', line: 'Maintain records of maintenance activities and completed work.'}
      ],
      focus: 'object-[58%_center]'
    },
    includes: [
      'System alerts sorted and prioritised',
      'Maintenance tasks scheduled and tracked',
      'Engineers assigned to the right jobs',
      'Installation workflows from start to sign-off',
      'Fault resolution, with follow-up checks',
      'A service history kept in every system profile'
    ],
    steps: [
      {title: 'An alert or task is raised', line: 'From monitoring, a customer report or a scheduled service.'},
      {title: 'The right engineer is assigned', line: 'With the system history and likely cause already in hand.'},
      {title: 'Resolved and recorded', line: 'The fix is confirmed against live data, then logged.'}
    ],
    outcomes: ['Faster, better-informed fixes', 'Fewer issues missed', 'Every visit on one record'],
    audience: ['Solar businesses', 'Engineers', 'Homeowners'],
    primary: {label: 'Arrange maintenance', to: '/contact?service=maintenance'},
    secondary: {label: 'Guardian Care for business', to: '/business'}
  },
  customer: {
    feature: {
      headline: 'One Platform. Intelligence for Everyone.',
      paragraphs: [
        'Guardian Care connects solar businesses, engineers and homeowners through one intelligent energy ecosystem, delivering the right insights, information and tools for everyone.'
      ],
      listTitle: 'Who it serves',
      columns: true,
      cover: [
        {
          eyebrow: '01 · Solar Businesses',
          name: 'See Your Entire Solar Portfolio.',
          line: 'Manage customer installations, track system performance and gain intelligent insights across your entire solar portfolio. Make better operational decisions, identify opportunities and deliver better ongoing customer care.'
        },
        {
          eyebrow: '02 · Engineers',
          name: 'Understand Every System. Work Smarter.',
          line: 'Access detailed system information, investigate performance issues and get AI-assisted technical insights to help diagnose problems, coordinate maintenance and make informed engineering decisions.'
        },
        {
          eyebrow: '03 · Homeowners',
          name: 'Understand Your Energy. Take Control.',
          line: 'See how your solar system performs, understand your household energy usage and receive personalised AI-powered insights to make smarter energy decisions every day.'
        }
      ],
      layout: 'table'
    },
    includes: [
      'System health at a glance',
      'Performance insights that make sense',
      'Personalised energy advice',
      'Monthly reports on how the system is doing',
      'Ongoing support from the Guardian Care team',
      'A clear message whenever something needs attention'
    ],
    steps: [
      {title: 'Get connected', line: 'Your system and your dashboard are set up together.'},
      {title: 'Stay informed', line: 'A live view, plus a monthly report on performance and savings.'},
      {title: 'Get support when needed', line: 'Advice and help from people who already know your system.'}
    ],
    outcomes: ['Confidence in how your solar is doing', 'More value from every unit it makes', 'Care that lasts as long as the system'],
    audience: ['Homeowners', 'Solar businesses'],
    primary: {label: 'Check my solar', to: '/consumer'},
    secondary: {label: 'Talk to the team', to: '/contact'}
  }
};

export const SERVICE_DETAILS: ServiceDetail[] = SERVICES.map((service) => ({...service, ...DETAILS[service.key]}));
