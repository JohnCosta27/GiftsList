<script lang="ts">
    import * as Y from "yjs";
    import { assert } from "./assert";
    import { IndexeddbPersistence } from "y-indexeddb";

    const DEFAULT_LIST = "default";
    const GIFT_INPUT_NAME = "gift-input-name";

    let form: HTMLFormElement;

    const doc = new Y.Doc();
    const defaultArray = doc.getArray(DEFAULT_LIST);

    const provider = new IndexeddbPersistence("current", doc);

    provider.on("synced", () => {
        console.log("content from the database is loaded");
    });

    let giftList = $state<Array<{ purchased: boolean; name: string }>>([]);

    const getYjsItem = (item: string): Y.Map<unknown> => {
        const yMap = new Y.Map();

        yMap.set("purchased", false);
        yMap.set("name", item);

        return yMap;
    };

    const submitItem: HTMLFormElement["onsubmit"] = (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const gift = formData.get(GIFT_INPUT_NAME)?.toString();
        assert(gift != null);

        defaultArray.push([getYjsItem(gift)]);
    };

    const checkItem = (index: number): void => {
        const gift = defaultArray.get(index) as Y.Map<unknown>;
        gift.set("purchased", !Boolean(gift.get("purchased")));
    };

    defaultArray.observeDeep(() => {
        giftList = defaultArray.toJSON();
        console.log(giftList);
    });
</script>

<main>
    <ol>
        {#each giftList.entries() as [index, gift]}
            <li>
                <input
                    type="checkbox"
                    bind:checked={gift.purchased}
                    onchange={() => checkItem(index)}
                />
                {gift.name}
            </li>
        {/each}
    </ol>
    <form onsubmit={submitItem} bind:this={form}>
        <input required name={GIFT_INPUT_NAME} />
        <button type="submit">Submit</button>
    </form>
</main>
