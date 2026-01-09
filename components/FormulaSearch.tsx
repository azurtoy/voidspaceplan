'use client';

import { useState, useMemo } from 'react';
import FormulaCard from './FormulaCard';

interface FormulaSearchProps {
  formulas: any[];
}

export default function FormulaSearch({ formulas }: FormulaSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFormulas = useMemo(() => {
    if (!searchTerm.trim()) return formulas;

    const term = searchTerm.toLowerCase();
    return formulas.filter(
      (formula) =>
        formula.name.toLowerCase().includes(term) ||
        (formula.description && formula.description.toLowerCase().includes(term)) ||
        formula.latex.toLowerCase().includes(term) ||
        (formula.variables && formula.variables.some((v: any) => 
          v.meaning.toLowerCase().includes(term) ||
          v.symbol.toLowerCase().includes(term)
        ))
    );
  }, [formulas, searchTerm]);

  return (
    <div className="mb-8">
      <div className="mb-6">
        <label htmlFor="formula-search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Formulas
        </label>
        <input
          id="formula-search"
          type="text"
          placeholder="Search by name or formula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredFormulas.length} of {formulas.length} formula{formulas.length !== 1 ? 's' : ''}
      </div>

      <div>
        {filteredFormulas.length > 0 ? (
          filteredFormulas.map((formula, idx) => (
            <FormulaCard key={idx} formula={formula} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No formulas found matching &quot;{searchTerm}&quot;</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
