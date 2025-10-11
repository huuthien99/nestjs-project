import { BadRequestException, Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import { runSandbox } from 'src/utils/sanbox';

Handlebars.registerHelper('eq', (a, b) => a === b);

Handlebars.registerHelper('timeoutValue', (timeWait) => {
  const t = Number(timeWait);
  return t === 0 ? 30000 : t * 1000;
});

function loadTemplate(keyword: string) {
  const path = `src/modules/flow/templates/${keyword}.hbs`;
  if (!fs.existsSync(path)) return null;
  return fs.readFileSync(path, 'utf8');
}

@Injectable()
export class FlowService {
  async runFlowService(flowData: any) {
    try {
      const order = this.buildExecutionOrder(flowData);
      const pieces: string[] = [];

      for (const node of order) {
        const templateName = node?.keyWord;
        if (!templateName) continue;

        const templateStr = loadTemplate(templateName);
        if (!templateStr) {
          console.warn(`Template not found: ${templateName}`);
          continue;
        }

        const template = Handlebars.compile(templateStr, { noEscape: true });
        const compiled = template({ data: node.data });
        pieces.push(compiled);
      }

      const fullScript = pieces.join('\n');

      // await runSandbox(fullScript);

      const result = await runSandbox(fullScript);
      if (!result.success) {
        return { status: 'error', message: result.error };
      }
      return { status: 'success', message: 'Flow executed successfully' };
    } catch (error: any) {
      throw new BadRequestException(
        error?.message || 'Error creating procedure',
      );
    }
  }

  buildExecutionOrder(flow: any) {
    if (!flow?.nodes?.length) return [];
    const map = new Map(flow.nodes.map((n) => [n.id, n]));
    const startNode =
      flow.nodes.find((n) => n.type === 'start') ?? flow.nodes[0];

    const order: any[] = [];
    let current = startNode;

    // Duyệt theo cạnh source->target; dừng nếu vòng lặp
    const visited = new Set<string>();
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      order.push(current);
      const nextEdge = flow.edges?.find?.((e) => e.source === current.id);
      if (!nextEdge) break;
      current = map.get(nextEdge.target);
    }

    return order;
  }
}
