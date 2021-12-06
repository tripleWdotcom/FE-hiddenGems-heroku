/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState, useContext } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { AuctionDetailsContext } from "../contexts/AuctionDetailsContext"
import CountdownTimer from "../components/CountdownTimer"

export default function BidModal({ activateModal, id, auctionEndTime }) {
  const [open, setOpen] = useState(false);
  const [bid, setBid] = useState("");
  const [highestBid, setHighestBid] = useState("");
  const cancelButtonRef = useRef(null);
  const { fetchAuctionItem } = useContext(AuctionDetailsContext);

  const placeBid = async () => {
    if (!bid || !id) return
    let obj = {
      itemId: id,
      bid: bid,
    };

    let res = await fetch("/api/bid/placeBid", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(obj),
    });

    res = await res.json();

    if (res.highestBid) {
      setHighestBid(res.highestBid)
    } else {
      setOpen(false)
    }
    await fetchAuctionItem(id)
  };

  useEffect(() => {
    setOpen(activateModal !== "init")
  }, [activateModal])

  useEffect(() => {
    if (!open) {
      setHighestBid("")
    }
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment} className="top-1/3 fixed">
      <Dialog
        as="div"
        className="flex justify-center z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center pt-4 px-4 pb-20 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="bg-myGr-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-myGr-dark px-4 py-4">
                <div className="text-center">
                  <Dialog.Title as="h3" className="text-lg font-medium text-white">
                    Time left:{" "}
                    <CountdownTimer auctionEndTime={auctionEndTime} />
                  </Dialog.Title>
                </div>
              </div>
              <div className="inputBid bg-myGr-dark px-4 py-4">
                <input
                  type="number"
                  className="w-full text-2xl rounded-md border my-2 py-2 font-medium text-black text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myGr-dark"
                  onChange={(e) => setBid(e.target.value)}
                  value={bid}
                  placeholder="€"
                />
                <button
                  type="button"
                  className="w-full rounded-md border my-2 border-transparent px-20 py-2 bg-myGr-light font-medium text-white focus:bg-myGr-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myGr-dark"
                  onClick={() => placeBid()}
                >
                  Place bid
                </button>
                {highestBid && (
                  <p className="text-xl font-semibold my-2 text-myAw bg-myRe rounded-md  py-2 text-center">
                    Current price is {highestBid}€
                  </p>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
