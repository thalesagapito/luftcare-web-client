# Molecules

All molecules must **have no defined place in a page by themselves**, this means that they **must be reusable**, and possibly receive props/emit events to determine their behavior/purpose.  
A `navbar` would **not** be a molecule because it can determine **where it should be** and **what is its purpose** by itself.  
As a rule of thumb molecules are relatively simple combinations of atoms built for **reuse**, they **must be extendable**.
Molecules must contain at least one atom, but never other molecules or organisms.
