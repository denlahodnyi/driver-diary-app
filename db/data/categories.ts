export const categories = [
  { name: 'Other', subcategories: [] },
  {
    name: 'Battery',
    subcategories: ['Battery charging', 'Battery replacement', 'Other'],
  },
  {
    name: 'Engine',
    subcategories: [
      'Engine diagnostic',
      'Engine repair',
      'Oil change and filter replacement',
      'Other',
    ],
  },
  {
    name: 'Brake System',
    subcategories: [
      'Brake inspection',
      'Brake fluid flush and replacement',
      'Brake pad replacement',
      'Other',
    ],
  },
  {
    name: 'Electrical System',
    subcategories: [
      'Starter replacement',
      'Alternator replacement',
      'Wiring repair',
      'Bulb replacement',
      'Other',
    ],
  },
  {
    name: 'Tires',
    subcategories: [
      'Balancing',
      'Alignment',
      'Flat tire repair',
      'Tire replacement',
      'Other',
    ],
  },
  {
    name: 'Transmission',
    subcategories: [
      'Fluid change',
      'Filter replacement',
      'Diagnostic testing',
      'Clutch repair',
    ],
  },
  {
    name: 'Cooling System',
    subcategories: [
      'Radiator flush and refill',
      'Thermostat replacement',
      'Water pump replacement',
      'Other',
    ],
  },
  { name: 'Wash', subcategories: [] },
  { name: 'Fuel', subcategories: [] },
];

export const categoriesWithIds = [
  { id: 'c4e8a4dc46a59d227183c', name: 'Other', subcategories: [] },
  {
    id: '83b67736e682386c9fcc2',
    name: 'Battery',
    subcategories: [
      {
        category_id: '83b67736e682386c9fcc2',
        id: '727de4b427cc732c8380f',
        name: 'Battery charging',
      },
      {
        category_id: '83b67736e682386c9fcc2',
        id: '7eeeab8576f7ad99d3939',
        name: 'Battery replacement',
      },
      {
        category_id: '83b67736e682386c9fcc2',
        id: '8c94a7f5e7c505fabe60c',
        name: 'Other',
      },
    ],
  },
  {
    id: '2f2b6655ad9a8e8645e73',
    name: 'Engine',
    subcategories: [
      {
        category_id: '2f2b6655ad9a8e8645e73',
        id: '6e278b27871a1632c3e9a',
        name: 'Engine diagnostic',
      },
      {
        category_id: '2f2b6655ad9a8e8645e73',
        id: 'f3a00a3f127513b46bedb',
        name: 'Engine repair',
      },
      {
        category_id: '2f2b6655ad9a8e8645e73',
        id: '8e2dd2053e6cecd5cc9c4',
        name: 'Oil change and filter replacement',
      },
      {
        category_id: '2f2b6655ad9a8e8645e73',
        id: '52ddfb09239e90499760d',
        name: 'Other',
      },
    ],
  },
  {
    id: '426879bfa5934981b39f9',
    name: 'Brake System',
    subcategories: [
      {
        category_id: '426879bfa5934981b39f9',
        id: 'd4b08afef7bed20f488e3',
        name: 'Brake inspection',
      },
      {
        category_id: '426879bfa5934981b39f9',
        id: '5f23560e937af8d61bee2',
        name: 'Brake fluid flush and replacement',
      },
      {
        category_id: '426879bfa5934981b39f9',
        id: 'b84096fb39218ee6b21c6',
        name: 'Brake pad replacement',
      },
      {
        category_id: '426879bfa5934981b39f9',
        id: '17ca56923fe388149065a',
        name: 'Other',
      },
    ],
  },
  {
    id: 'f54c0b44976ad1c98bcc9',
    name: 'Electrical System',
    subcategories: [
      {
        category_id: 'f54c0b44976ad1c98bcc9',
        id: 'b331663121aaf2775f2f0',
        name: 'Starter replacement',
      },
      {
        category_id: 'f54c0b44976ad1c98bcc9',
        id: '3a50ba6d393cc3dc8e0cd',
        name: 'Alternator replacement',
      },
      {
        category_id: 'f54c0b44976ad1c98bcc9',
        id: '7704c73dbb20edb1884a8',
        name: 'Wiring repair',
      },
      {
        category_id: 'f54c0b44976ad1c98bcc9',
        id: '1cdeea855d175e3cd693a',
        name: 'Bulb replacement',
      },
      {
        category_id: 'f54c0b44976ad1c98bcc9',
        id: 'f81e3fdf341e18e27c62a',
        name: 'Other',
      },
    ],
  },
  {
    id: '2ac223e0f54207c0778d4',
    name: 'Tires',
    subcategories: [
      {
        category_id: '2ac223e0f54207c0778d4',
        id: '60dd07f54f84bf23657e4',
        name: 'Balancing',
      },
      {
        category_id: '2ac223e0f54207c0778d4',
        id: 'cdc9c36138ddedb277d32',
        name: 'Alignment',
      },
      {
        category_id: '2ac223e0f54207c0778d4',
        id: '0a4c51088181f4a64f30c',
        name: 'Flat tire repair',
      },
      {
        category_id: '2ac223e0f54207c0778d4',
        id: 'bd513d22a32187b990b64',
        name: 'Tire replacement',
      },
      {
        category_id: '2ac223e0f54207c0778d4',
        id: '3c2074677a8c00a353646',
        name: 'Other',
      },
    ],
  },
  {
    id: '33b8965b16ca14d3a0027',
    name: 'Transmission',
    subcategories: [
      {
        category_id: '33b8965b16ca14d3a0027',
        id: 'afddbe8b3f9964b8ea78f',
        name: 'Fluid change',
      },
      {
        category_id: '33b8965b16ca14d3a0027',
        id: 'ce8e5232d493e66146901',
        name: 'Filter replacement',
      },
      {
        category_id: '33b8965b16ca14d3a0027',
        id: '65fe87b79fc3dcd715b5a',
        name: 'Diagnostic testing',
      },
      {
        category_id: '33b8965b16ca14d3a0027',
        id: 'ac4aaa6a82f778eae32ab',
        name: 'Clutch repair',
      },
    ],
  },
  {
    id: 'e9eaa2e7b91cf074abed2',
    name: 'Cooling System',
    subcategories: [
      {
        category_id: 'e9eaa2e7b91cf074abed2',
        id: '7180b7bd3bf065728b4d8',
        name: 'Radiator flush and refill',
      },
      {
        category_id: 'e9eaa2e7b91cf074abed2',
        id: '13e85122b570a654d7a24',
        name: 'Thermostat replacement',
      },
      {
        category_id: 'e9eaa2e7b91cf074abed2',
        id: '30f5bf08763e0d606c72b',
        name: 'Water pump replacement',
      },
      {
        category_id: 'e9eaa2e7b91cf074abed2',
        id: '00c235c30c26bbe2f46f6',
        name: 'Other',
      },
    ],
  },
  { id: '17604fa06e24f301c5b89', name: 'Wash', subcategories: [] },
  { id: '6eed2a9dd0c124329b75c', name: 'Fuel', subcategories: [] },
];
