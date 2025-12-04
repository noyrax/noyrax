```mermaid
graph TD
    N0["../cache/dependencies-cache"]
    N1["../cache/signature-cache"]
    N2["../constants.js"]
    N3["../core/consolidation"]
    N4["../core/scanner"]
    N5["../core/signature-formatter"]
    N6["../core/symbol-classifier"]
    N7["../core/symbols"]
    N8["../generator/index"]
    N9["../index/index"]
    N10["../logging/index"]
    N11["../parsers/dependencies"]
    N12["../parsers/json-yaml"]
    N13["../parsers/ts-js"]
    N14["../parsers/types"]
    N15["../types.js"]
    N16["./cache/ast-cache"]
    N17["./cache/dependencies-cache"]
    N18["./cache/output-cache"]
    N19["./cache/signature-cache"]
    N20["./cli/init.js"]
    N21["./cli/update.js"]
    N22["./constants.js"]
    N23["./core/async"]
    N24["./core/consolidation"]
    N25["./core/git"]
    N26["./core/scanner"]
    N27["./dependencies"]
    N28["./drift/index"]
    N29["./generator/change-report"]
    N30["./generator/dependency-graph"]
    N31["./generator/index"]
    N32["./index/index"]
    N33["./init.js"]
    N34["./language-detection"]
    N35["./mcp/server.js"]
    N36["./mcp/types.js"]
    N37["./module-doc"]
    N38["./parsers/dependencies"]
    N39["./parsers/json-yaml"]
    N40["./parsers/python"]
    N41["./parsers/ts-js"]
    N42["./parsers/types"]
    N43["./resources/docs.js"]
    N44["./signature-matching"]
    N45["./status"]
    N46["./symbols"]
    N47["./tools/drift.js"]
    N48["./tools/impact.js"]
    N49["./tools/scan.js"]
    N50["./tools/validate.js"]
    N51["./types"]
    N52["./types.js"]
    N53["./ui/commands-provider"]
    N54["./ui/status-bar"]
    N55["./update.js"]
    N56["./validator/index"]
    N57["./validator/status"]
    N58["_modelcontextprotocol/sdk/server"]
    N59["_modelcontextprotocol/sdk/server/stdio.js"]
    N60["_modelcontextprotocol/sdk/types.js"]
    N61["child_process"]
    N62["commander"]
    N63["crypto"]
    N64["demo/src/calculator.ts"]
    N65["demo/src/user-service.ts"]
    N66["fs"]
    N67["ignore"]
    N68["mcp/src/resources/docs.ts"]
    N69["mcp/src/server.ts"]
    N70["mcp/src/tools/drift.ts"]
    N71["mcp/src/tools/impact.ts"]
    N72["mcp/src/tools/scan.ts"]
    N73["mcp/src/tools/validate.ts"]
    N74["node_child_process"]
    N75["node_fs"]
    N76["node_fs/promises"]
    N77["node_path"]
    N78["node_readline"]
    N79["node_url"]
    N80["node_util"]
    N81["os"]
    N82["packages/doc-system-agent/src/cli/index.ts"]
    N83["packages/doc-system-agent/src/cli/init.ts"]
    N84["packages/doc-system-agent/src/cli/update.ts"]
    N85["packages/doc-system-agent/src/index.ts"]
    N86["packages/doc-system-agent/src/mcp/resources/docs.ts"]
    N87["packages/doc-system-agent/src/mcp/server.ts"]
    N88["packages/doc-system-agent/src/mcp/tools/drift.ts"]
    N89["packages/doc-system-agent/src/mcp/tools/impact.ts"]
    N90["packages/doc-system-agent/src/mcp/tools/scan.ts"]
    N91["packages/doc-system-agent/src/mcp/tools/validate.ts"]
    N92["path"]
    N93["src/__tests__/determinism.test.ts"]
    N94["src/__tests__/parser-symbol-types.test.ts"]
    N95["src/__tests__/signature-formatter.test.ts"]
    N96["src/__tests__/snapshot-doc-generation.test.ts"]
    N97["src/__tests__/symbol-classifier.test.ts"]
    N98["src/cache/ast-cache.ts"]
    N99["src/cache/dependencies-cache.ts"]
    N100["src/cache/output-cache.ts"]
    N101["src/cache/signature-cache.ts"]
    N102["src/core/consolidation.ts"]
    N103["src/core/git.ts"]
    N104["src/core/scanner.ts"]
    N105["src/core/signature-formatter.ts"]
    N106["src/core/symbol-classifier.ts"]
    N107["src/core/symbols.ts"]
    N108["src/drift/index.ts"]
    N109["src/extension.ts"]
    N110["src/generator/change-report.ts"]
    N111["src/generator/dependency-graph.ts"]
    N112["src/generator/index.ts"]
    N113["src/generator/module-doc.ts"]
    N114["src/index/index.ts"]
    N115["src/parsers/dependencies.ts"]
    N116["src/parsers/json-yaml.ts"]
    N117["src/parsers/python.ts"]
    N118["src/parsers/ts-js.ts"]
    N119["src/ui/commands-provider.ts"]
    N120["src/ui/status-bar.ts"]
    N121["src/validator/index.ts"]
    N122["src/validator/signature-matching.ts"]
    N123["tree-sitter"]
    N124["tree-sitter-python"]
    N125["ts-morph"]
    N126["vscode"]
    N127["yaml"]

    N100 --> N63
    N100 --> N66
    N100 --> N92
    N101 --> N66
    N101 --> N92
    N102 --> N0
    N102 --> N11
    N102 --> N14
    N102 --> N46
    N103 --> N61
    N104 --> N10
    N104 --> N34
    N104 --> N66
    N104 --> N67
    N104 --> N92
    N105 --> N14
    N106 --> N14
    N107 --> N14
    N107 --> N63
    N108 --> N1
    N108 --> N14
    N108 --> N7
    N109 --> N126
    N109 --> N16
    N109 --> N17
    N109 --> N18
    N109 --> N19
    N109 --> N23
    N109 --> N24
    N109 --> N25
    N109 --> N26
    N109 --> N28
    N109 --> N29
    N109 --> N30
    N109 --> N31
    N109 --> N32
    N109 --> N38
    N109 --> N39
    N109 --> N40
    N109 --> N41
    N109 --> N42
    N109 --> N53
    N109 --> N54
    N109 --> N56
    N109 --> N57
    N109 --> N66
    N109 --> N92
    N110 --> N11
    N110 --> N14
    N111 --> N11
    N112 --> N14
    N112 --> N37
    N112 --> N66
    N112 --> N92
    N113 --> N14
    N113 --> N5
    N113 --> N6
    N114 --> N11
    N114 --> N14
    N114 --> N66
    N114 --> N7
    N114 --> N92
    N115 --> N125
    N115 --> N92
    N116 --> N127
    N116 --> N51
    N116 --> N92
    N117 --> N123
    N117 --> N124
    N117 --> N27
    N117 --> N51
    N117 --> N92
    N118 --> N125
    N118 --> N27
    N118 --> N51
    N118 --> N92
    N119 --> N126
    N120 --> N126
    N121 --> N10
    N121 --> N14
    N121 --> N44
    N121 --> N45
    N121 --> N66
    N121 --> N92
    N122 --> N14
    N122 --> N5
    N122 --> N6
    N122 --> N7
    N64 --> N51
    N65 --> N51
    N68 --> N76
    N68 --> N77
    N69 --> N43
    N69 --> N47
    N69 --> N48
    N69 --> N49
    N69 --> N50
    N69 --> N58
    N69 --> N59
    N69 --> N60
    N70 --> N74
    N70 --> N76
    N70 --> N77
    N70 --> N80
    N71 --> N75
    N71 --> N77
    N71 --> N78
    N72 --> N74
    N72 --> N80
    N73 --> N74
    N73 --> N80
    N82 --> N2
    N82 --> N33
    N82 --> N55
    N82 --> N62
    N83 --> N2
    N83 --> N76
    N83 --> N77
    N83 --> N79
    N84 --> N2
    N84 --> N76
    N84 --> N77
    N84 --> N79
    N85 --> N20
    N85 --> N21
    N85 --> N22
    N85 --> N35
    N85 --> N36
    N86 --> N76
    N86 --> N77
    N87 --> N43
    N87 --> N47
    N87 --> N48
    N87 --> N49
    N87 --> N50
    N87 --> N52
    N87 --> N58
    N87 --> N59
    N87 --> N60
    N88 --> N15
    N88 --> N74
    N88 --> N76
    N88 --> N77
    N88 --> N80
    N89 --> N15
    N89 --> N75
    N89 --> N77
    N89 --> N78
    N90 --> N15
    N90 --> N74
    N90 --> N80
    N91 --> N15
    N91 --> N74
    N91 --> N80
    N93 --> N13
    N93 --> N4
    N93 --> N66
    N93 --> N7
    N93 --> N8
    N93 --> N81
    N93 --> N92
    N94 --> N12
    N94 --> N13
    N94 --> N5
    N95 --> N14
    N95 --> N5
    N96 --> N13
    N96 --> N14
    N96 --> N3
    N96 --> N66
    N96 --> N8
    N96 --> N81
    N96 --> N9
    N96 --> N92
    N97 --> N14
    N97 --> N6
    N98 --> N63
    N98 --> N66
    N98 --> N92
    N99 --> N66
    N99 --> N92
```