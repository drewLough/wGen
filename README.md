wGen - A utility app for various randomly generated data.

## Words 
Currently only english is available, the options shape the outputs. Words are created by combining Consonant and Vowel phonemes.
Temaplates can be used to specify the structure of the outputs. C = Consonant, V = Vowel, N = Number, () = optional flag. ie. CVCN would return something like Kun9.
Other grammer syntax (such as hyphens) get passed through. 

Note: When a template is provided, length/start parameters are ignored and instead the generation follows the template exactly. When template is empty, the default generation will alternate between consonants and vowels (as determined by length)

npm run dev : starts a local webserver & transpiles the typescript to javascript.
