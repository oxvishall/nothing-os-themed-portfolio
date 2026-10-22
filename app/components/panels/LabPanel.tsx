'use client';

import DotPlayground from '@/app/components/DotPlayground';
import NdotGenerator from '@/app/components/NdotGenerator';

// Interactive experiments: everything runs in the browser
export default function LabPanel() {
  return (
    <div className="lab-panel">
      <header className="px-6 md:px-8 pt-8 pb-6 flex items-end justify-between gap-4">
        <div>
          <span className="font-dot text-[10px] text-tertiary tracking-widest uppercase block mb-1 opacity-70">
            Experiments
          </span>
          <h3 className="font-serif text-3xl tracking-tight text-primary leading-tight">THE LAB</h3>
        </div>
        <span className="font-dot text-[10px] text-tertiary uppercase tracking-widest">
          Play around
        </span>
      </header>

      <section className="lab-section" aria-labelledby="lab-playground">
        <div className="lab-section-head">
          <h4 id="lab-playground" className="font-dot text-[10px] text-tertiary uppercase tracking-widest">
            01 · Dot Playground
          </h4>
          <p className="text-secondary text-sm mt-1">
            Draw on the matrix, stamp a word, then hit Life and watch it evolve.
          </p>
        </div>
        <DotPlayground />
      </section>

      <section className="lab-section" aria-labelledby="lab-generator">
        <div className="lab-section-head">
          <h4 id="lab-generator" className="font-dot text-[10px] text-tertiary uppercase tracking-widest">
            02 · Dot Matrix Generator
          </h4>
          <p className="text-secondary text-sm mt-1">
            Turn any photo into Nothing-style dot art, then download it.
          </p>
        </div>
        <NdotGenerator />
      </section>
    </div>
  );
}
