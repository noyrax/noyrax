```mermaid
graph TD
    N0["../cache/dependencies-cache"]
    N1["../cache/signature-cache"]
    N2["../constants.js"]
    N3["../core/scanner"]
    N4["../core/signature-formatter"]
    N5["../core/symbols"]
    N6["../generator/index"]
    N7["../logging/index"]
    N8["../parsers/dependencies"]
    N9["../parsers/json-yaml"]
    N10["../parsers/ts-js"]
    N11["../parsers/types"]
    N12["../types.js"]
    N13["./cache/ast-cache"]
    N14["./cache/dependencies-cache"]
    N15["./cache/output-cache"]
    N16["./cache/signature-cache"]
    N17["./cli/init.js"]
    N18["./cli/update.js"]
    N19["./constants.js"]
    N20["./core/async"]
    N21["./core/consolidation"]
    N22["./core/git"]
    N23["./core/scanner"]
    N24["./dependencies"]
    N25["./drift/index"]
    N26["./generator/change-report"]
    N27["./generator/dependency-graph"]
    N28["./generator/index"]
    N29["./index/index"]
    N30["./init.js"]
    N31["./language-detection"]
    N32["./mcp/server.js"]
    N33["./mcp/types.js"]
    N34["./module-doc"]
    N35["./parsers/dependencies"]
    N36["./parsers/json-yaml"]
    N37["./parsers/python"]
    N38["./parsers/ts-js"]
    N39["./parsers/types"]
    N40["./resources/docs.js"]
    N41["./signature-matching"]
    N42["./status"]
    N43["./symbols"]
    N44["./tools/drift.js"]
    N45["./tools/impact.js"]
    N46["./tools/scan.js"]
    N47["./tools/validate.js"]
    N48["./types"]
    N49["./types.js"]
    N50["./ui/commands-provider"]
    N51["./ui/status-bar"]
    N52["./update.js"]
    N53["./validator/index"]
    N54["./validator/status"]
    N55["_modelcontextprotocol/sdk/server"]
    N56["_modelcontextprotocol/sdk/server/stdio.js"]
    N57["_modelcontextprotocol/sdk/types.js"]
    N58["child_process"]
    N59["commander"]
    N60["crypto"]
    N61["demo/src/calculator.ts"]
    N62["demo/src/user-service.ts"]
    N63["fs"]
    N64["ignore"]
    N65["mcp/src/resources/docs.ts"]
    N66["mcp/src/server.ts"]
    N67["mcp/src/tools/drift.ts"]
    N68["mcp/src/tools/impact.ts"]
    N69["mcp/src/tools/scan.ts"]
    N70["mcp/src/tools/validate.ts"]
    N71["node_child_process"]
    N72["node_fs"]
    N73["node_fs/promises"]
    N74["node_path"]
    N75["node_readline"]
    N76["node_url"]
    N77["node_util"]
    N78["os"]
    N79["packages/doc-system-agent/src/cli/index.ts"]
    N80["packages/doc-system-agent/src/cli/init.ts"]
    N81["packages/doc-system-agent/src/cli/update.ts"]
    N82["packages/doc-system-agent/src/index.ts"]
    N83["packages/doc-system-agent/src/mcp/resources/docs.ts"]
    N84["packages/doc-system-agent/src/mcp/server.ts"]
    N85["packages/doc-system-agent/src/mcp/tools/drift.ts"]
    N86["packages/doc-system-agent/src/mcp/tools/impact.ts"]
    N87["packages/doc-system-agent/src/mcp/tools/scan.ts"]
    N88["packages/doc-system-agent/src/mcp/tools/validate.ts"]
    N89["path"]
    N90["src/__tests__/determinism.test.ts"]
    N91["src/__tests__/parser-symbol-types.test.ts"]
    N92["src/cache/ast-cache.ts"]
    N93["src/cache/dependencies-cache.ts"]
    N94["src/cache/output-cache.ts"]
    N95["src/cache/signature-cache.ts"]
    N96["src/core/consolidation.ts"]
    N97["src/core/git.ts"]
    N98["src/core/scanner.ts"]
    N99["src/core/signature-formatter.ts"]
    N100["src/core/symbols.ts"]
    N101["src/drift/index.ts"]
    N102["src/extension.ts"]
    N103["src/generator/change-report.ts"]
    N104["src/generator/dependency-graph.ts"]
    N105["src/generator/index.ts"]
    N106["src/generator/module-doc.ts"]
    N107["src/index/index.ts"]
    N108["src/parsers/dependencies.ts"]
    N109["src/parsers/json-yaml.ts"]
    N110["src/parsers/python.ts"]
    N111["src/parsers/ts-js.ts"]
    N112["src/ui/commands-provider.ts"]
    N113["src/ui/status-bar.ts"]
    N114["src/validator/index.ts"]
    N115["src/validator/signature-matching.ts"]
    N116["tree-sitter"]
    N117["tree-sitter-python"]
    N118["ts-morph"]
    N119["vscode"]
    N120["yaml"]

    N100 --> N11
    N100 --> N60
    N101 --> N1
    N101 --> N11
    N101 --> N5
    N102 --> N119
    N102 --> N13
    N102 --> N14
    N102 --> N15
    N102 --> N16
    N102 --> N20
    N102 --> N21
    N102 --> N22
    N102 --> N23
    N102 --> N25
    N102 --> N26
    N102 --> N27
    N102 --> N28
    N102 --> N29
    N102 --> N35
    N102 --> N36
    N102 --> N37
    N102 --> N38
    N102 --> N39
    N102 --> N50
    N102 --> N51
    N102 --> N53
    N102 --> N54
    N102 --> N63
    N102 --> N89
    N103 --> N11
    N103 --> N8
    N104 --> N8
    N105 --> N11
    N105 --> N34
    N105 --> N63
    N105 --> N89
    N106 --> N11
    N107 --> N11
    N107 --> N5
    N107 --> N63
    N107 --> N8
    N107 --> N89
    N108 --> N118
    N108 --> N89
    N109 --> N120
    N109 --> N48
    N109 --> N89
    N110 --> N116
    N110 --> N117
    N110 --> N24
    N110 --> N48
    N110 --> N89
    N111 --> N118
    N111 --> N24
    N111 --> N48
    N111 --> N89
    N112 --> N119
    N113 --> N119
    N114 --> N11
    N114 --> N41
    N114 --> N42
    N114 --> N63
    N114 --> N7
    N114 --> N89
    N115 --> N11
    N115 --> N5
    N61 --> N48
    N62 --> N48
    N65 --> N73
    N65 --> N74
    N66 --> N40
    N66 --> N44
    N66 --> N45
    N66 --> N46
    N66 --> N47
    N66 --> N55
    N66 --> N56
    N66 --> N57
    N67 --> N71
    N67 --> N73
    N67 --> N74
    N67 --> N77
    N68 --> N72
    N68 --> N74
    N68 --> N75
    N69 --> N71
    N69 --> N77
    N70 --> N71
    N70 --> N77
    N79 --> N2
    N79 --> N30
    N79 --> N52
    N79 --> N59
    N80 --> N2
    N80 --> N73
    N80 --> N74
    N80 --> N76
    N81 --> N2
    N81 --> N73
    N81 --> N74
    N81 --> N76
    N82 --> N17
    N82 --> N18
    N82 --> N19
    N82 --> N32
    N82 --> N33
    N83 --> N73
    N83 --> N74
    N84 --> N40
    N84 --> N44
    N84 --> N45
    N84 --> N46
    N84 --> N47
    N84 --> N49
    N84 --> N55
    N84 --> N56
    N84 --> N57
    N85 --> N12
    N85 --> N71
    N85 --> N73
    N85 --> N74
    N85 --> N77
    N86 --> N12
    N86 --> N72
    N86 --> N74
    N86 --> N75
    N87 --> N12
    N87 --> N71
    N87 --> N77
    N88 --> N12
    N88 --> N71
    N88 --> N77
    N90 --> N10
    N90 --> N3
    N90 --> N5
    N90 --> N6
    N90 --> N63
    N90 --> N78
    N90 --> N89
    N91 --> N10
    N91 --> N4
    N91 --> N9
    N92 --> N60
    N92 --> N63
    N92 --> N89
    N93 --> N63
    N93 --> N89
    N94 --> N60
    N94 --> N63
    N94 --> N89
    N95 --> N63
    N95 --> N89
    N96 --> N0
    N96 --> N11
    N96 --> N43
    N96 --> N8
    N97 --> N58
    N98 --> N31
    N98 --> N63
    N98 --> N64
    N98 --> N7
    N98 --> N89
    N99 --> N11
```