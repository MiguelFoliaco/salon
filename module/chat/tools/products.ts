import { getBranches } from "@/module/branches/actions/get-branch";
import { getConfiguration } from "@/module/configurations/actions/get-configurations";
import { getProducts } from "@/module/product/actions/get-products";

export const search_product = async (toolCall: any, contextMessages: any, assistantMessage: string, branchId: string) => {
    console.log('Ejecutando herramienta: search_products', toolCall.args);

    const productsResult = await getProducts({
        ...toolCall.args.parameters,
        query: toolCall.args.query,
        branchId: branchId
    });

    // 5. Segunda llamada a OpenRouter con el resultado de la herramienta
    const toolContext = [
        ...contextMessages,
        { role: 'assistant', content: assistantMessage },
        { role: 'system', content: `Resultado de la búsqueda: ${JSON.stringify(productsResult.data || [])}` }
    ];

    return toolContext;
}


export const list_branches = async (toolCall: any, contextMessages: any, assistantMessage: string) => {
    console.log('Ejecutando herramienta: list_branches', toolCall.args);

    const configuration = await getConfiguration();
    const branchesResult = await getBranches(configuration.data?.id || '');

    // 5. Segunda llamada a OpenRouter con el resultado de la herramienta
    const toolContext = [
        ...contextMessages,
        { role: 'assistant', content: assistantMessage },
        { role: 'system', content: `Resultado de la búsqueda: ${JSON.stringify(branchesResult.data || [])}` }
    ];

    return toolContext;
}