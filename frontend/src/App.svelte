<script lang="ts">
    import * as Y from "yjs";
    import { assert } from "./assert";

    const DEFAULT_LIST = "default";
    const GIFT_INPUT_NAME = "gift-input-name";

    let form: HTMLFormElement;

    const doc = new Y.Doc();
    const defaultArray = doc.getArray(DEFAULT_LIST);

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

    const checkItem = (state: boolean, index: number): void => {
        const gift = defaultArray.get(index) as Y.Map<unknown>;
        gift.set("purchsed", state);
    };

    defaultArray.observeDeep(() => {
        giftList = defaultArray.toJSON();
    });
</script>

<main>
    <ol>
        {#each giftList.entries() as [index, gift]}
            <li>
                <input
                    type="checkbox"
                    value={gift.purchased}
                    onchange={(e) =>
                        checkItem(Boolean(e.currentTarget.value), index)}
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
