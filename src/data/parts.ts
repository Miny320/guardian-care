import type {GlyphName} from '../components/Glyph';
import type {Country} from './countries';

// The parts of a home solar system, in the order power flows, named the way each country names them.
// Shown on the Solar tools page and in the home page's "Why Guardian Care" slider.
// Parts with a product picture show it; the two isolators fall back to an icon.
export type Part = {key: string; name: string; glyph: GlyphName; image?: string; does: string; fails: string};

export function systemParts(country: Country): Part[] {
  return [
    {key: 'panels', name: 'Solar panels', glyph: 'solarRoof', image: '/assets/parts/panels.png', does: 'Turn sunlight into DC electricity on your roof.', fails: 'Dirt, shading and ageing slowly cut their output, often without anyone noticing.'},
    {key: 'dc', name: 'DC isolator', glyph: 'tool', image: '/assets/parts/dc-isolator.png', does: 'Lets the panels be safely disconnected from the inverter.', fails: 'Water getting in and worn switches are a known fire risk on older systems.'},
    {key: 'inverter', name: 'Inverter', glyph: 'inverter', image: '/assets/parts/inverter.png', does: 'Turns the panels’ DC power into AC power your home can use.', fails: 'The part most likely to fail. Many last 10 to 15 years, shorter than the panels.'},
    {key: 'battery', name: 'Battery', glyph: 'storage', image: '/assets/parts/battery.png', does: 'Stores daytime solar so you can use it in the evening.', fails: 'Wrong settings can leave it charging from the grid or running flat too early.'},
    {key: 'ac', name: 'AC isolator', glyph: 'connect', image: '/assets/parts/ac-isolator.png', does: 'A switch that cuts the solar system off from your home’s wiring.', fails: 'Must be easy to reach and in good order for safe maintenance.'},
    {key: 'board', name: country.words.panel.replace(/^./, (c) => c.toUpperCase()), glyph: 'health', image: '/assets/parts/surge-protector.png', does: `Your ${country.words.panel} holds the breaker that protects the solar circuit.`, fails: 'Missing surge protection or the wrong breaker leaves the system exposed.'},
    {key: 'meter', name: 'Meter', glyph: 'grid', image: '/assets/parts/smart-meter.png', does: `Records what you buy from your ${country.words.supplier} and, where fitted, what you export.`, fails: 'A faulty or wrong meter means you may be paid less than you should.'}
  ];
}
