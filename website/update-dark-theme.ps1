# PowerShell Script zum Aktualisieren aller Komponenten auf Dark Theme
# Führt globale Ersetzungen durch

$components = @(
    "src/components/Pricing.astro",
    "src/components/Footer.astro",
    "src/components/UseCases.astro",
    "src/components/Workflows.astro",
    "src/components/HowItWorks.astro",
    "src/components/Metrics.astro",
    "src/components/QuickStart.astro",
    "src/components/Demo.astro"
)

$replacements = @{
    'bg-white' = 'bg-logo-bg'
    'bg-slate-50' = 'bg-logo-bg-alt'
    'bg-slate-100' = 'bg-logo-bg-alt'
    'text-slate-700' = 'text-logo-white'
    'text-slate-600' = 'text-logo-gray'
    'text-slate-500' = 'text-logo-gray'
    'text-slate-400' = 'text-logo-gray'
    'text-doc-navy' = 'text-logo-white'
    'border-slate-200' = 'border-logo-cyan/20'
    'border-slate-700' = 'border-logo-cyan/30'
    'bg-noyrax-blue' = 'bg-logo-cyan'
    'text-noyrax-blue' = 'text-logo-cyan'
    'border-noyrax-blue' = 'border-logo-cyan'
}

foreach ($file in $components) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $original = $content
        
        foreach ($key in $replacements.Keys) {
            $content = $content -replace $key, $replacements[$key]
        }
        
        if ($content -ne $original) {
            Set-Content $file $content
            Write-Host "Updated: $file"
        }
    }
}

Write-Host "Done!"

