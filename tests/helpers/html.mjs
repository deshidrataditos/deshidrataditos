import {parse} from "parse5";

// Inspect the original document as HTML5. Never strip comments or rewrite tags:
// browsers accept malformed endings that string filters do not model correctly.
export function inspectHTML(source) {
  const document = parse(source,{sourceCodeLocationInfo:true});
  const tags = [];
  function visit(node) {
    if (node.tagName) tags.push({
      name:node.tagName,
      attrs:new Map(node.attrs.map(({name,value}) => [name,value])),
      index:node.sourceCodeLocation?.startOffset ?? -1,
      text:(node.childNodes || []).filter(child => child.nodeName === "#text").map(child => child.value).join(""),
      node
    });
    for (const child of node.childNodes || []) visit(child);
    if (node.content) visit(node.content);
  }
  visit(document);
  return tags;
}
