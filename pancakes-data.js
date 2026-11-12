const baseIngredients = ['1 cup flour', '2 eggs', '1 cup milk'];
const baseSteps = [
  'Mix the flour, eggs and milk until smooth.',
  'Pour a little batter into a hot, buttered pan.',
  'Cook until bubbles appear, then flip. Cook 1 more minute.'
];

const pancakes = [
  { id: 'nutella', name: 'Pancake with Nutella', emoji: '🍫', color: '#8b5a2b', toppings: ['Nutella'], finish: 'Spread Nutella on top.' },
  { id: 'cream', name: 'Pancake with whipped cream', emoji: '🥫', icon: '<svg viewBox="0 0 64 64" width="1em" height="1em" aria-hidden="true"><path d="M31 2c-5 2-7 5-3 7-6 0-7 5-1 6h10c6-1 5-6-1-6 4-2 1-5-5-7z" fill="#fff" stroke="#d9d2c5" stroke-width="1.5"/><rect x="29" y="14" width="6" height="7" rx="1.5" fill="#e63946"/><rect x="22" y="20" width="20" height="6" rx="2" fill="#c9ced6"/><rect x="18" y="25" width="28" height="37" rx="5" fill="#5aa9e6"/><rect x="18" y="34" width="28" height="12" fill="#fff"/><path d="M23 40c3-4 6 4 9 0s6 4 9 0" stroke="#5aa9e6" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="22" y="28" width="3" height="30" rx="1.5" fill="#fff" opacity=".35"/></svg>', color: '#5aa9e6', toppings: ['Whipped cream'], finish: 'Add a big swirl of whipped cream on top.' },
  { id: 'sprinkles', name: 'Pancake with sprinkles', emoji: '🌈', color: '#e85d9e', toppings: ['Sprinkles'], finish: 'Shake lots of sprinkles on top.' },
  { id: 'everything', name: 'Pancake with everything', emoji: '🤩', color: '#f2a516', toppings: ['Nutella', 'Whipped cream', 'Sprinkles', 'Powdered sugar'], finish: 'Spread Nutella, add whipped cream, sprinkles and a dusting of powdered sugar.' }
];
